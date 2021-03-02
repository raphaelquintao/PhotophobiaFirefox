// function setSidebarStyle(theme) {
//     if (theme.colors && (theme.colors.sidebar || theme.colors.frame)) {
//         document.body.style.backgroundColor = theme.colors.sidebar || theme.colors.frame;
//         document.documentElement.style.backgroundColor = theme.colors.sidebar || theme.colors.frame;
//     } else {
//         document.body.style.backgroundColor = "white";
//     }
//
//     console.log('THEME UPDATE', theme);
// }

// Set the element style when the extension page loads
// async function setInitialStyle() {
//     const theme = await browser.theme.getCurrent();
//     setSidebarStyle(theme);
// }

// setInitialStyle();

// Watch for theme updates
browser.theme.onUpdated.addListener(async ({theme, windowId}) => {
    const sidebarWindow = await browser.windows.getCurrent();
    /*
      Only update theme if it applies to the window the sidebar is in.
      If a windowId is passed during an update, it means that the theme is applied to that specific window.
      Otherwise, the theme is applied globally to all windows.
    */
    if (!windowId || windowId == sidebarWindow.id) {
        // setSidebarStyle(theme);
        // set_background(theme.colors.sidebar);
    }

    // console.log('THEME UPDATE');
});

async function set_background(color) {
    // document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
    console.log('INIT SIDEBAR');
}

set_background('hsl(0, 0%, 9%)');



let debug = document.getElementById('debug');

let d = browser.storage.sync.getBytesInUse();
d.then(value => {
    // console.log('GET SYNC', value);
    debug.innerText = JSON.stringify(value);
    
}, reason => {
    // console.log('FAIL GET SYNC', reason);
});

let p = browser.storage.sync.get('qColor');
p.then(value => {
    // console.log('GET SYNC', value);
    debug.innerText += JSON.stringify(value);
    
}, reason => {
    // console.log('FAIL GET SYNC', reason);
});
    
    

