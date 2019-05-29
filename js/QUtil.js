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
            input.focus();
        };
        
        this.input = input;
        
        this.onChange = (value, name) => {
        
        };
        
        this.appendTo = (el) => {
            el.append(container);
        };
    }
    
    get value() {
        return this.input.value;
    }
    
    set value(val) {
        this.input.value = val;
        this.input.dispatchEvent(new Event('input'));
    }
    
}

export class QColor {
    
    constructor(name = "QGray") {
        this.name = name;
        
        this.text = {
            hue: 214,
            sat: 2,
            bri: 100
        };
        
        this.panel = {
            hue: 214,
            sat: 5,
            bri: 100
        };
        
    }
    
    getTextPreviewColor() {
        let b = QColor.bright(this.text.bri, 75);
        return `hsl(${this.text.hue}, ${this.text.sat}%, ${b}%)`;
    }
    
    getPanelPreviewColor() {
        let b = QColor.bright(this.panel.bri, 25);
        return `hsl(${this.panel.hue}, ${this.panel.sat}%, ${b}%)`;
    }
    
    parse({name, text, panel}) {
        this.name = name;
        this.text = text;
        this.panel = panel;
    }
    
    apply() {
        return QColor.updateColor(this);
    }
    
    static bright(value = 100, percent) {
        let result = value / 100 * percent;
        if (result <= 0) return 1;
        if (result >= 100) return 100;
        return result;
    }
    
    /**
     * Set Browser Colors
     * @param {QColor} qcolor
     * @param shadow
     */
    static updateColor(qcolor, shadow = false) {
        let text = qcolor.text;
        let panel = qcolor.panel;
        let bright = QColor.bright;
        
        
        let theme = {
            'colors': {
                // "accentcolor": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 7)}%)`,
                "frame": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 7)}%)`,
                "frame_inactive": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 8)}%)`,
                "button_background_hover": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 0.7)`,
                "button_background_active": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 1)`,
                "icons": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%, 0.74)`,
                "icons_attention": `hsl(${text.hue}, ${text.sat}%, ${bright(text.bri, 59)}%)`,
       
                // -- Toolbar
                "toolbar": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 25)}%)`,
                // "toolbar_text": `hsl(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%)`,
                "bookmark_text": `hsl(${text.hue}, ${text.sat}%,${bright(text.bri, 75)}%)`,
                
                "toolbar_vertical_separator": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 0.8)`,
                "toolbar_top_separator": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 1)`,
                "toolbar_bottom_separator": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 5)}%, 1)`,
                
                // -- URL Bar
                "toolbar_field": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 14)}%)`,
                "toolbar_field_focus": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 14)}%)`,
                "toolbar_field_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 70)}%, 1)`,
                "toolbar_field_text_focus": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 70)}%, 1)`,
                "toolbar_field_border": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 1)`,
                "toolbar_field_border_focus": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 1)`,
                "toolbar_field_separator": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 0.8)`,
                // "toolbar_field_separator": `red`,
                
                "popup": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 14)}%)`,
                "popup_border": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 22)}%, 1)`,
                "popup_highlight": `hsla(${panel.hue}, 2%, ${bright(panel.bri, 75)}%, 0.1)`,
                "popup_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 70)}%, 1)`,
                "popup_highlight_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%, 1)`,
                "tab_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 80)}%, 1)`,
                "tab_background_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 65)}%, 0.5)`,
                // "tab_background_text": `hsla(${panel.hue}, 2%, 70%, 1)`,
                
                "tab_line": `hsla(${panel.hue}, ${panel.sat}%, ${bright(text.bri, 31)}%, 0)`,
                "tab_loading": `hsla(${text.hue}, 74%, ${bright(text.bri, 51)}%, 0.5)`,
                // "tab_selected": `hsla(372, 74%, 44%, 1)`,
                
                "tab_background_separator": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 35)}%, 0.8)`,
                // "tab_background_separator": `red`,
                
                // -- Sidebar
                "sidebar": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 24)}%, 1)`,
                "sidebar_border": `hsla(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 30)}%, 1)`,
                "sidebar_highlight": `hsla(${panel.hue}, 2%, ${bright(panel.bri, 75)}%, 0.2)`,
                "sidebar_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%, 1)`,
                "sidebar_highlight_text": `hsla(${text.hue}, ${text.sat}%, ${bright(text.bri, 75)}%, 1)`,
                // -- New Tab
                "ntp_background": `hsl(${panel.hue}, ${panel.sat}%, ${bright(panel.bri, 7)}%)`,
                "ntp_text": `hsl(${text.hue}, ${text.sat}%, ${bright(text.bri, 50)}%)`
            }
        };
        
        // let info = browser.runtime.getBrowserInfo();
        // info.then(value => {
        //     console.log(value);
        // });
        
        
        console.info('Update Color');
        
        browser.theme.update(theme);
        return qcolor;
    }
    
}

export class QStorage {
    
    
    static saveSync(data) {
        let p = browser.storage.sync.set(data);
        
    }
    
    static getSync(data) {
        let p = browser.storage.sync.get(data);
        return p;
    }
    
    static clearSync(data) {
        let p = browser.storage.sync.clear();
        // p.then(value => {
        //     console.log(value);
        // });
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