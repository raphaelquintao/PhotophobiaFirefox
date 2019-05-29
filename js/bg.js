import {QColor, QStorage, QSlider} from "./QUtil.js";

let colors = {
    def: new QColor(),
    cur: new QColor()
};

window.colors = colors;





// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // console.log('onMessage BG', message, sender, sendResponse);
//
//     if (message === 'info')
//         sendResponse(getInfo());
//
// });




// -- Main
function main() {
    colors.def.apply();
    
    QStorage.getSync('qColor')
        .then(value => {
            if (value.qColor) {
                colors.cur.parse(value.qColor);
                colors.cur.apply();
            }
        });
    
    let info = browser.runtime.getBrowserInfo();
    info.then(value => {
        console.log(value);
    });
}

main();

