import {QColor, QSlider, QStorage} from "./QUtil.js";

console.info('Controls');

let opt_text = document.getElementById('opt-text');
let opt_panel = document.getElementById('opt-panel');

let text_preview = document.getElementById('text-preview');
let panel_preview = document.getElementById('panel-preview');


let btn_reload = document.getElementById('btn-reload');
let btn_default = document.getElementById('btn-default');
let btn_save = document.getElementById('btn-save');
// let btn_sync = document.getElementById('btn-sync');

let text_hue = new QSlider('text_hue', 'Hue:', 0, 360);
let text_sat = new QSlider('text_sat', 'Sat:', 0, 100);
let text_bri = new QSlider('text_bri', 'Bri:', 0, 125);

let panel_hue = new QSlider('panel_hue', 'Hue:', 0, 360);
let panel_sat = new QSlider('panel_sat', 'Sat:', 0, 100);
let panel_bri = new QSlider('panel_bri', 'Bri:', 0, 150);

text_hue.appendTo(opt_text);
text_sat.appendTo(opt_text);
text_bri.appendTo(opt_text);

panel_hue.appendTo(opt_panel);
panel_sat.appendTo(opt_panel);
panel_bri.appendTo(opt_panel);


function getColor(qColor = new QColor()) {
    // let qColor = new QColor();
    qColor.text.hue = text_hue.value;
    qColor.text.sat = text_sat.value;
    qColor.text.bri = text_bri.value;
    
    qColor.panel.hue = panel_hue.value;
    qColor.panel.sat = panel_sat.value;
    qColor.panel.bri = panel_bri.value;
    return qColor;
}

function setColor(qColor) {
    text_hue.value = qColor.text.hue;
    text_sat.value = qColor.text.sat;
    text_bri.value = qColor.text.bri;
    
    panel_hue.value = qColor.panel.hue;
    panel_sat.value = qColor.panel.sat;
    panel_bri.value = qColor.panel.bri;
    
    setPreviewColor(qColor);
}

function setPreviewColor(qColor) {
    text_preview.style.backgroundColor = qColor.getTextPreviewColor();
    panel_preview.style.backgroundColor = qColor.getPanelPreviewColor();
    
    console.log('Panel Preview', qColor.getPanelPreviewColor())
}


function setHandlerEvents(handler) {
    text_hue.onChange = handler;
    text_sat.onChange = handler;
    text_bri.onChange = handler;
    
    panel_hue.onChange = handler;
    panel_sat.onChange = handler;
    panel_bri.onChange = handler;
}


btn_reload.onclick = ev => {
    ev.preventDefault();
    browser.runtime.reload();
};



btn_save.onclick = ev => {
    ev.preventDefault();
    let qColor = getColor();
    
    QStorage.saveSync({qColor});
};

// btn_sync.onclick = ev => {
//     ev.preventDefault();
//     panel_bri.value = 20;
// };



// browser.runtime.sendMessage('info')
//     .then(response => {
//         // console.info(response);
//     });

let bg = browser.runtime.getBackgroundPage();
bg.then(page => {
    // console.info('SideBar', 'has bg');
    // console.info(page);
    
    page.debug();
    
    let colors = page.colors;
    console.log(colors);
    setColor(colors.cur);
    
    btn_default.onclick = ev => {
        ev.preventDefault();
        setColor(colors.def);
    };
    
    function onChangeHandler(value, name) {
        // let qColor = colors.cur;
        let qColor = getColor(colors.cur);
        qColor.apply();
        console.log('Input Name:', name);
        setPreviewColor(qColor);
    }
    
    setHandlerEvents(onChangeHandler);
    
});
















