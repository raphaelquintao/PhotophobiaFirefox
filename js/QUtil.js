export function QRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export class QSlider {
    
    constructor(name, label = 'QSlider', min = 0, max = 100, value = 0) {
        let container = document.createElement('label');
        container.classList.add('qSlider');
        
        let title = document.createElement('span');
        title.innerText = label;
        let info = document.createElement('span');
        info.innerText = value;
        info.classList.add('info');
        
        
        let input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.value = value;
        input.name = name;
        
        container.append(title);
        container.append(input);
        container.append(info);
        
        
        input.oninput = (ev) => {
            info.innerText = input.value;
            this.onChange(input.value, input.name);
        };
        
        input.onmouseenter = (ev) => {
            if (QSlider.focus_on_hover()) input.focus();
        };
        
        this.container = container;
        this.input = input;
        
        this.onChange = (value, name) => {
            
        };
        
        
        this.appendTo = (el) => {
            el.append(container);
            return this;
        };
        
    }
    
    get value() {
        return this.input.value;
    }
    
    set value(val) {
        this.input.value = val;
        this.input.dispatchEvent(new Event('input'));
    }
    
    static focus_on_hover() {
        return true;
    }
    
    disabled(editable = true) {
        this.input.disabled = !editable;
        if (!editable) this.container.classList.add('disabled');
        else this.container.classList.remove('disabled');
    }
}

export class QCollection {
    
    constructor() {
        this._selected = "";
        this.schemes = {};
        
        this.onSelect = (scheme, id) => {
            // scheme.apply();
        };
        
        return this;
    }
    
    
    /**
     * Add new Scheme to collection.
     * @param {QColor} scheme
     * @param {boolean} selected
     */
    add(scheme, selected = false) {
        let found = this.find(scheme);
        if (found === false) {
            this.schemes[scheme.id] = scheme;
            if (selected) this._selected = scheme.id;
        }
    }
    
    /**
     * Remove Scheme from collection.
     * @param {QColor} scheme
     */
    remove(scheme) {
        let found = this.find(scheme);
        if (found !== false) delete this.schemes[scheme.id];
    }
    
    /**
     * Find Scheme in collection by ID.
     * @param {string} id
     * @return {QColor|boolean}
     */
    findByID(id) {
        for (let key of Object.keys(this.schemes)) {
            if (this.schemes[key].id === id)
                return this.schemes[key];
        }
        return false;
    }
    
    /**
     * Find Scheme in collection.
     * @param {QColor} scheme
     * @return {QColor|boolean}
     */
    find(scheme) {
        return this.findByID(scheme.id);
    }
    
    /**
     * Select Scheme by ID.
     * @param {string} id
     * @param {boolean} emit
     */
    selectById(id, emit = true) {
        let scheme = this.findByID(id);
        if (scheme !== false) {
            this._selected = id;
            if (emit) this.onSelect(scheme, id);
        }
    }
    
    /**
     * Select Scheme.
     * @param {QColor} scheme
     * @param {boolean} emit
     */
    select(scheme, emit = true) {
        this.selectById(scheme.id, emit);
    }
    
    /**
     * Get selected Scheme.
     * @return {QColor|boolean}
     */
    getSelected() {
        return this.findByID(this._selected);
    }
    
    applySelected(emit = true) {
        let scheme = this.getSelected();
        scheme.apply();
        if (emit) this.onSelect(scheme, scheme.id);
    }
    
    parse(obj) {
        let selected = obj._selected;
        let schemes = obj.schemes;
        
        for (let key of Object.keys(schemes)) {
            let scheme = new QColor();
            scheme.parse(schemes[key]);
            this.add(scheme);
        }
        this._selected = selected;
        
        return this;
    }
    
    /** @return {QCollection} */
    clone() {
        let cur = JSON.parse(JSON.stringify(this));
        return new QCollection().parse(cur);
    }
    
    getFlat() {
        return JSON.parse(JSON.stringify(this));
    }
    
    equals(qcollection) {
        return (JSON.stringify(this) === JSON.stringify(qcollection));
    }
    
    clear() {
        for (let sc of this) {
            if (sc.editable) this.remove(sc);
        }
    }
    
    [Symbol.iterator]() {
        let data = Object.values(this.schemes);
        let index = -1;
        
        return {
            next: () => ({value: data[++index], done: !(index in data)})
        };
    };
}

export class QColor {
    
    constructor(name = "", id = "") {
        this.id = (id === "") ? QColor.unique_id() : id;
        this.name = (name === "") ? 'no_name_scheme' : name;
        
        this.text = {hue: 214, sat: 2, bri: 73};
        this.panel = {hue: 214, sat: 5, bri: 37};
        
        this.saved = false;
        this.synced = false;
        this.shadow = false;
        
        return this;
    }
    
    get editable() {
        return (!this.id.match(/^_.+/));
    }
    
    getTextPreviewColor() {
        let b = QColor.bright(this.text.bri, 100);
        return `hsl(${this.text.hue}, ${this.text.sat}%, ${b}%)`;
    }
    
    getPanelPreviewColor() {
        let b = QColor.bright(this.panel.bri, 71);
        return `hsl(${this.panel.hue}, ${this.panel.sat}%, ${b}%)`;
    }
    
    parse({id, name, text, panel, saved = false, synced = false, shadow}) {
        if (id) this.id = id;
        if (name) this.name = name;
        if (text) {
            this.text.hue = parseInt(text.hue);
            this.text.sat = parseInt(text.sat);
            this.text.bri = parseInt(text.bri);
        }
        if (panel) {
            this.panel.hue = parseInt(panel.hue);
            this.panel.sat = parseInt(panel.sat);
            this.panel.bri = parseInt(panel.bri);
        }
        if (saved) this.saved = saved;
        if (synced) this.synced = synced;
        if (shadow) this.shadow = shadow;
        
        return this;
    }
    
    apply() {
        // let title = `Photophobia - ${this.name}`;
        // browser.browserAction.setTitle({title: title});
        
        return QColor.updateColor(this, this.shadow);
    }
    
    /** @return {QColor} */
    clone() {
        let cur = JSON.parse(JSON.stringify(this));
        return new QColor().parse(cur);
    }
    
    getStr(){
        return JSON.parse(JSON.stringify(this));
    }
    
    equals(qcolor) {
        return (JSON.stringify(this) === JSON.stringify(qcolor));
    }
    
    /**
     * Set Browser Colors
     * @param {QColor} qcolor
     * @param {Boolean} shadow
     */
    static updateColor(qcolor, shadow = false) {
        let text = qcolor.text;
        let panel = qcolor.panel;
        let bright = QColor.bright;
        
        
        
        let bbp = 90; // Border Bright Percent, Toolbar and Tabs
        
        let pSatDecay = Math.ceil(panel.sat * ((panel.bri / 100) * 1.5));
        
        let pHueComp = QColor.hueRotate(panel.hue, 130);
        let tHueComp = QColor.hueRotate(text.hue, 130);
        
        let hlcolor = `hsla(${pHueComp}, 50%, ${bright(text.bri, 80)}%, 1)`;
        
        let theme = {
            'colors': {
                // "accentcolor": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 7)}%)`,
                "frame":                    `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 22)}%, 1)`,
                "frame_inactive":           `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 22)}%, 1)`,
                "button_background_hover":  `hsla(${panel.hue}, 2%, 100%, 0.1)`,
                "button_background_active": `hsla(${panel.hue}, 2%, 100%, 0.2)`,
                "icons":                    `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 100)}%, 0.65)`,
                "icons_attention":          hlcolor,
                
                // -- Tabs
                "tab_text":                 `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 106)}%, 1)`,
                "tab_background_text":      `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 85)}%, 0.5)`,
                "tab_background_separator": `hsla(0, 0%, 100%, 0.3)`,
                
                "tab_line":    `hsla(${pHueComp}, ${panel.sat}%, ${bright(panel.bri, 71)}%, 0)`,
                "tab_loading": hlcolor,
                // "tab_selected": `hsla(${pHueComp}, 50%, ${bright(text.bri, 80)}%, 1)`,
                
                // -- Toolbar
                "toolbar":       `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 71)}%)`,
                // "toolbar_text": `hsl(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%)`,
                "bookmark_text": `hsl(${text.hue}, ${text.sat}%,${bright(text.bri, 100)}%)`,
                
                "toolbar_vertical_separator": `hsla(${panel.hue}, ${pSatDecay}%, ${bright(panel.bri, bbp)}%, 0.7)`,
                "toolbar_top_separator":      `hsla(${panel.hue}, ${pSatDecay}%, ${bright(panel.bri, bbp)}%, 1)`,
                "toolbar_bottom_separator":   `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 15)}%, 1)`,
                
                // -- URL Bar
                "toolbar_field":                `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 40)}%, 0.97)`,
                "toolbar_field_focus":          `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 40)}%, 0.97)`,
                "toolbar_field_text":           `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 93)}%, 1)`,
                "toolbar_field_text_focus":     `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 99)}%, 1)`,
                "toolbar_field_highlight":      `hsla(${text.hue}, ${pSatDecay}%, 100%, 0.17)`,
                "toolbar_field_highlight_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 99)}%, 1)`,
                "toolbar_field_border":         `hsla(${panel.hue}, ${pSatDecay}%, ${bright(panel.bri, bbp)}%, 1)`,
                "toolbar_field_border_focus":   `hsla(${panel.hue}, ${pSatDecay}%, ${bright(panel.bri, bbp)}%, 1)`,
                "toolbar_field_separator":      `hsla(0, 0%, 100%, 0.13)`,
                
                // -- Popup
                "popup":                `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 48)}%, 1)`,
                "popup_border":         `hsla(0, 0%, 100%, 0.12)`,
                // "popup_highlight": `hsla(${pHueComp}, 50%, ${bright(panel.bri, 100)}%, 0.1)`,
                "popup_highlight":      `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 21)}%, 1)`,
                "popup_text":           `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 93)}%, 1)`,
                "popup_highlight_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 97)}%, 1)`,
                
                
                
                
                // -- Sidebar
                "sidebar":                `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 65)}%, 1)`,
                "sidebar_border":         `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 15)}%, 1)`,
                "sidebar_highlight":      `hsla(0, 0%, 100%, 0.1)`,
                "sidebar_text":           `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 93)}%, 1)`,
                "sidebar_highlight_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 100)}%, 1)`,
                
                // -- New Tab
                "ntp_background": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 22)}%)`,
                "ntp_text":       `hsl(${text.hue}, ${text.sat}%, ${bright(text.bri, 66)}%)`
            }
        };
        
        if (shadow) {
            theme.images = {
                "theme_frame": "assets/blank.png"
            }
        }
        
        
        browser.theme.update(theme);
        
        console.info('Color Updated', theme);
        return qcolor;
    }
    
    static bright(value = 100, percent) {
        let result = value / 100 * percent;
        if (result <= 0) return 0;
        if (result >= 100) return 100;
        return result;
    }
    
    static hueRotate(hue, deg) {
        return (hue + deg) % 360;
    }
    
    static unique_id() {
        return Math.random().toString(36).substr(2, 9);
    }
    
}

export class QStorage {
    
    static saveLocal(data) {
        let p = browser.storage.local.set(data);
    }
    
    static getLocal(data) {
        let p = browser.storage.local.get(data);
        return p;
    }
    
    static clearLocal() {
        let p = browser.storage.local.clear();
        return p;
    }
    
    static saveSync(data) {
        let p = browser.storage.sync.set(data);
    }
    
    static getSync(data) {
        let p = browser.storage.sync.get(data);
        return p;
    }
    
    static clearSync() {
        let p = browser.storage.sync.clear();
        return p;
    }
    
    static inUseLocal() {
        
        let p = browser.storage.local.toString();
        console.info('Storage', p);
        // p.then(value => {
        //     console.info('Storage', value);
        // });
        
        // let resp = browser.storage.sync.get('colors');
        
        // resp.then(value => {
        //     console.log(value);
        //
        // });
        
        
        // browser.storage.local.getBytesInUse(function (bytes) {
        //     var total_kb = 5242880 / 1024;
        //     var kb = bytes / 1024;
        //     var percent = (bytes * 100) / 5242880;
        //     console.log(kb + " kb of " + total_kb + " kb - " + percent + " %");
        // });
    }
}