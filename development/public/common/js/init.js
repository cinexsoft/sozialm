import { setVariable, EXISTS_ANDROID_INTERFACE, } from '/common/js/variables.js';
import { getUserInfo, generateUserToken, getLongDateTime, } from '/common/js/generalfunc.js';

/* Uncomment to start displaying logs in the console.
 * setVariable('DEBUG', true);
 */

// upload logs in intervals for current session
setInterval(() => {
    uploadSessionLogs();
}, 5000);

// user ID recognises a person while user token recognises a device
getUserInfo();
generateUserToken();

// rest imports
import { uploadSessionLogs, log, err, } from '/common/js/logging.js';
import { Dialog, Menu, } from '/common/js/overlays.js';

// global onclick listeners
document.body.addEventListener('click', (e) => {
    log(`common.js: click: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
    if (['alertDialog_btn', 'actionDialog_btnClose'].includes(e.target.id) && e.target.innerHTML == 'Close') {
        e.target.id.slice(0, 5) == 'alert' ? Dialog.hide('alert') : Dialog.hide('action');
    } else if (['menuRoot', 'actionDialogRoot'].includes(e.target.id)) {
        e.target.id.slice(0, 4) == 'menu' ? Menu.hide() : Dialog.hide('action');
    }
});

console.log('common.js: loaded');
log(`[AND]: common.js: WebAppInterface: ${EXISTS_ANDROID_INTERFACE}`);