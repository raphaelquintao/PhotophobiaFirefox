import {QSlider, QCollection, QColor, QStorage} from "./QUtil.js";

// console.info('Controls');

let IGNORE_EVENTS = false;
let EDITING_NAME = false;
let TMP = null;

// -- BG Functions
function bg_change_name(id, new_name) {
    browser.runtime.sendMessage({key: 'change_name', id: id, new_name: new_name})
        .then(response => {
            // console.info(response);
        });
}

function bg_set_scheme(id) {
    TMP = null;
    browser.runtime.sendMessage({key: 'set_scheme', value: id})
        .then(response => {
            // console.info(response);
        });
}


// -- HEADER
let scheme_select = document.getElementById('scheme-select');
scheme_select.onchange = ev => {
    let id = ev.target.value;
    // console.log('SELECTED', id);
    bg_set_scheme(id);
};


let scheme_name = document.getElementById('scheme-name');
scheme_name.onkeydown = ev => {
    // console.info(ev.key);
    if (ev.key === 'Enter' || ev.key === 'Tab') {
        ev.preventDefault();
        ev.target.blur();
    }
};

scheme_name.onfocus = ev => {
    // console.log('focus');
    EDITING_NAME = true;
};

scheme_name.onblur = ev => {
    // console.log('unfocus');
    EDITING_NAME = false;
    let id = scheme_select.value;
    let new_name = scheme_name.innerText;
    new_name = new_name.trim();
    bg_change_name(id, new_name);
};


// -- BUTTONS
let btn_del = document.getElementById('btn-del');
let btn_undo = document.getElementById('btn-undo');
let btn_new = document.getElementById('btn-new');

let btn_reload = document.getElementById('btn-reload');
let btn_default = document.getElementById('btn-default');
let btn_save = document.getElementById('btn-save');
let btn_sync = document.getElementById('btn-sync');

// -- SLIDERS

QSlider.focus_on_hover = () => {
    return !EDITING_NAME;
};

let opt_text = document.getElementById('opt-text');
let opt_panel = document.getElementById('opt-panel');

let text_preview = document.getElementById('text-preview');
let panel_preview = document.getElementById('panel-preview');


let text_hue = new QSlider('text_hue', 'Hue:', 0, 360);
let text_sat = new QSlider('text_sat', 'Sat:', 0, 100);
let text_bri = new QSlider('text_bri', 'Bri:', 0, 100); //125

let panel_hue = new QSlider('panel_hue', 'Hue:', 0, 360);
let panel_sat = new QSlider('panel_sat', 'Sat:', 0, 100);
let panel_bri = new QSlider('panel_bri', 'Bri:', 0, 100); //150

text_hue.appendTo(opt_text);
text_sat.appendTo(opt_text);
text_bri.appendTo(opt_text);

panel_hue.appendTo(opt_panel);
panel_sat.appendTo(opt_panel);
panel_bri.appendTo(opt_panel);



// -- Functions

function can_focus_slider() {
    return !EDITING_NAME;
}

function scheme_select_add(id, name, selected = false) {
    let option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    option.selected = selected;
    
    scheme_select.append(option);
}

/** @param {QCollection} qCollection */
function scheme_select_fill(qCollection) {
    scheme_select.innerHTML = '';
    for (let scheme of qCollection) {
        let selected = (qCollection._selected === scheme.id);
        scheme_select_add(scheme.id, scheme.name, selected);
    }
}

function setPreviewColor(qColor) {
    text_preview.style.backgroundColor = qColor.getTextPreviewColor();
    panel_preview.style.backgroundColor = qColor.getPanelPreviewColor();
}

/**
 * @param {QColor} scheme
 * @param {boolean} ignore
 */
function setColor(scheme, ignore = true) {
    IGNORE_EVENTS = ignore;
    text_hue.value = scheme.text.hue;
    text_sat.value = scheme.text.sat;
    text_bri.value = scheme.text.bri;
    
    panel_hue.value = scheme.panel.hue;
    panel_sat.value = scheme.panel.sat;
    panel_bri.value = scheme.panel.bri;
    
    
    
    setPreviewColor(scheme);
    scheme_name.innerText = scheme.name;
    
    IGNORE_EVENTS = false;
}

/** @param {QColor} scheme */
function updateScheme(scheme) {
    scheme.text.hue = parseInt(text_hue.value);
    scheme.text.sat = parseInt(text_sat.value);
    scheme.text.bri = parseInt(text_bri.value);
    
    scheme.panel.hue = parseInt(panel_hue.value);
    scheme.panel.sat = parseInt(panel_sat.value);
    scheme.panel.bri = parseInt(panel_bri.value);
    setPreviewColor(scheme);
    
    return scheme;
}




function setHandlerEvents(handler) {
    text_hue.onChange = handler;
    text_sat.onChange = handler;
    text_bri.onChange = handler;
    
    panel_hue.onChange = handler;
    panel_sat.onChange = handler;
    panel_bri.onChange = handler;
}

btn_del.onclick = ev => {
    ev.preventDefault();
    let id = scheme_select.value;
    browser.runtime.sendMessage({key: 'del', id: id})
        .then(response => {
            // console.info(response);
        });
};

btn_undo.onclick = ev => {
    ev.preventDefault();
    // let id = scheme_select.value;
    if (TMP !== null) {
        browser.runtime.sendMessage({key: 'undo', serialized: TMP.getStr()})
            .then(response => {
                // console.info(response);
            });
    }
};

btn_new.onclick = ev => {
    ev.preventDefault();
    browser.runtime.sendMessage({key: 'new', name: ''})
        .then(response => {
            // console.info(response);
        });
};


btn_reload.onclick = ev => {
    ev.preventDefault();
    // QStorage.clearLocal();
    // QStorage.clearSync();
    browser.runtime.reload();
};

btn_default.onclick = ev => {
    ev.preventDefault();
    
    // bg_set_scheme('_default');
    let sure = confirm("Are you sure you want to reset?\nAll saved schemes will be lost forever.");
    if (sure) {
        // QStorage.clearLocal();
        // QStorage.clearSync();
        browser.runtime.sendMessage({key: 'clear'})
            .then(response => {
                // console.info(response);
            });
    }
    
};

btn_sync.onclick = ev => {
    ev.preventDefault();
    browser.runtime.sendMessage({key: 'sync'})
        .then(response => {
            // console.info(response);
        });
};

btn_save.onclick = ev => {
    ev.preventDefault();
    browser.runtime.sendMessage({key: 'save'})
        .then(response => {
            // console.info(response);
        });
};





// -- MESSAGES
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log('onMessage Options', message, sender);
    // console.log('onMessage Options', message);
    
    if (message.key === 'refresh') {
        main();
    } else if (message.key === 'scheme_changed') {
        main();
    } else if (message.key === 'update_others') {
        // console.log('UPDATE UI');
        updateSliders();
    }
    
});


function updateSliders() {
    let bg = browser.runtime.getBackgroundPage();
    bg.then(page => {
        let qsynced = page.q.synced;
        let qsaved = page.q.saved;
        let qcolors = page.q.colors;
        let scheme = qcolors.getSelected();
        
        setColor(scheme);
        setState(qcolors, qsynced, qsaved);
    });
}

function setState(qcolors, qsynced, qsaved) {
    
    // console.log('TMP', TMP);
    
    let can_undo = false;
    if (TMP !== null) {
        can_undo = (!qcolors.getSelected().equals(TMP));
    }
    
    btn_sync.disabled = (qcolors.equals(qsynced));
    
    
    let editable = qcolors.getSelected().editable;
    btn_save.disabled = (qcolors.equals(qsaved));
    
    
    btn_undo.style.display = (editable && can_undo) ? '' : 'none';
    
    btn_del.style.display = (editable) ? '' : 'none';
    scheme_name.contentEditable = (editable) ? 'true' : 'false';
    
    // Editable
    text_hue.disabled(editable);
    text_sat.disabled(editable);
    text_bri.disabled(editable);
    
    panel_hue.disabled(editable);
    panel_sat.disabled(editable);
    panel_bri.disabled(editable);
}


// -- MAIN
function main() {
    let bg = browser.runtime.getBackgroundPage();
    bg.then(page => {
        // page.debug();
        
        // console.log('SCHEMEs', page.q);
        let qsynced = page.q.synced;
        let qsaved = page.q.saved;
        let qcolors = page.q.colors;
        // console.log('SAME', qsaved.equals(qsynced));
        
        let scheme = qcolors.getSelected();
        if (TMP === null) TMP = scheme.clone();
        
        scheme_select_fill(qcolors);
        setColor(scheme, true);
        setState(qcolors, qsynced, qsaved);
        
        // console.log('TMP1', TMP);
        
        function onChangeHandler(value, name) {
            if (IGNORE_EVENTS) return;
            let qColor = updateScheme(qcolors.getSelected());
            qColor.apply();
            setState(qcolors, qsynced, qsaved);
            
            browser.runtime.sendMessage({key: 'update_others'});
        }
        
        setHandlerEvents(onChangeHandler);
        
    });
}

main();















