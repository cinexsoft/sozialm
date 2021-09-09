// common.js

// global theme colors
let accent_primary_bgcolor = "#075E54";
let accent_secondary_bgcolor = "#dcf8c6";
let accent_tertiary_bgcolor = "#ece5dd";
let accent_fg_color = "#ffffff";

// user token
let userToken = "";

// flags
let debug = !true;
let loadtheme = !true;

// overlay controls
const overlay = {
    instanceOpen: false,
    animDuration: 250
}

// logger data
const logs = {} || JSON.parse(localStorage.getItem("records.logs"));
const errors = {} || JSON.parse(localStorage.getItem("records.errors"));
const warnings = {} || JSON.parse(localStorage.getItem("records.warnings")); 

const getTimeStamp = () => {
    return new Date().getTime();
}

const getLongDateTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    return (Intl.DateTimeFormat().resolvedOptions().timeZone) + "/" + year + "-" + month + "-" + date + " @ " + hours + ":" + minutes + ":" + seconds;
}

// console functions
const log = (val) => {
    if (debug) console.log("Log: " + val);
    // write logs in local database
    logs[getTimeStamp()] = val;
    localStorage.setItem("records.logs", JSON.stringify(logs));
}

const err = (val) => {
    if (debug) console.error("Err: " + val);
    // write logs in local database
    errors[getTimeStamp()] = val;
    localStorage.setItem("records.errors", JSON.stringify(errors));
}

const wrn = (val) => {
    if (debug) console.warn("Wrn: " + val);
    // write logs in local database
    warnings[getTimeStamp()] = val;
    localStorage.setItem("records.warnings", JSON.stringify(warnings));
}

const uploadFullLogs = () => {
    firebase.database().ref(dbRoot + "/records/fulllogs/" + userToken + "/" + getLongDateTime()).update({
        logs: JSON.parse(localStorage.getItem("records.logs")),
        errors: JSON.parse(localStorage.getItem("records.errors")),
        warnings: JSON.parse(localStorage.getItem("records.warnings"))
    })
    .then(() => {
        if (debug) console.info("Log: uploaded full logs to database");
    },
    (e) => {
        throw e;
    });
}

const generateToken = (length) => {
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let b = [];  
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

// user token is used to mark a message
const generateUserToken = () => {
    userToken = localStorage.getItem("User.token");
    if (userToken == undefined) {
        userToken = generateToken(64);
        localStorage.setItem("User.token", userToken);
        log("new token = " + userToken);
    }
    else {
        userToken = userToken;
        log("token = " + userToken);
    }
}

// replace unsupported firebase characters with something else
const encode = (str) => {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll(c, "ASCII" + c.charCodeAt(0));
    }
    if (debug) console.log("Log: encode(): str = " + str);
    return str;
}

// data decoder function, replace encoded chars with special characters
const decode = (str) => {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll("ASCII" + c.charCodeAt(0), c);
    }
    if (debug) console.log("Log: decode(): str = " + str);
    return str;
}

// download a file
const download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// copy text
const copyPlainTxt = ({ innerHTML }) => {
    navigator.clipboard.writeText(
        innerHTML.replace(/<br>/g, '\n')
                 .replace(/<[^>]*>/g, '')
    )
    .then(() => {
    })
    .catch((e) => {
        err(e);
        dialog.display("Uh oh!", "Copy text to clipboard failed");
    });
}

// detect browser
const getBrowser = () => { 
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return "opera";
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1 ) {
        return "chrome";
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        return "safari";
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1 ){
        return "firefox";
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return "IE";
    }
    else {
        return "unknown";
    }
}

// js element selector function, inspired by JQuery
const $ = function cssStyleElementSelector(val) {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) {
        return document.querySelectorAll(val);
    }
    switch (val.charAt(0)) {
        case "#":
            return document.getElementById(val.substring(1));
        case ".":
            return document.getElementsByClassName(val.substring(1));
        default:
            return document.getElementsByTagName(val);
    }
}

// get child element using css selectors
const getChildElement = (element, val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) {
        return element.querySelectorAll(val);
    }
    switch (val.charAt(0)) {
        case "#":
            return element.getElementById(val.substring(1));
        case ".":
            return element.getElementsByClassName(val.substring(1));
        default:
            return element.getElementsByTagName(val);
    }
}

// checks if the parent has the passed child
const hasElementAsParent = (child, parent) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            log("node " + node.nodeName + " has parent = " + parent.nodeName);
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/*!
 * JavaScript detach - v0.2 - 5/18/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
// Visit: https://gist.github.com/cowboy/938767
const appendHTMLString = (element, str) => {
    let parent =  element.parentNode;
    let next = element.nextSibling;
    if (!parent) return;                // No parent node? Abort!
    parent.removeChild(element);        // Detach node from DOM.
    element.innerHTML += str;           // append html string
    parent.insertBefore(element, next); // Re-attach node to DOM.
}

// dialog
const dialog = {
    display(title, message, button = "Close", func) {
        if (button != undefined &&
            typeof button != "string") {
            throw "Error: typeof button title is "+ (typeof button) + ", expected string";
            return;
        }
        else if (func != undefined &&
                 typeof func != "function") {
            throw "Error: typeof function is "+ (typeof func) + ", expected function";
            return;
        }
        // delay when one overlay is already open
        let timeout;
        if (overlay.instanceOpen) {
            timeout = overlay.animDuration;
        }
        else {
            timeout = 0;
        }
        setTimeout(() => {
            getChildElement($("#dialog"), "h2")[0].innerHTML = title;
            getChildElement($("#dialog"), "div")[0].innerHTML = message.replace(/\n/g, "<br>");
            getChildElement($("#dialog"), "button")[0].innerHTML = button;
            getChildElement($("#dialog"), "button")[0].addEventListener("click", (e) => {
                if (func != undefined) {
                    func();
                }
            });
            $("#dialogRoot").style.animation = "fadeIn " + overlay.animDuration + "ms forwards";
            $("#dialog").style.animation = "scaleIn " + overlay.animDuration + "ms forwards";
            overlay.instanceOpen = true;
        }, timeout);
    },
    hide(func) {
        // additional function
        if (func != undefined) {
            func();
        }
        $("#dialogRoot").style.animation = "fadeOut " + overlay.animDuration + "ms forwards";
        $("#dialog").style.animation = "scaleOut " + overlay.animDuration + "ms forwards";
        setTimeout(() => {
            overlay.instanceOpen = false;
        }, overlay.animDuration);
    }
}

// menu dialog
const menu = {
    display() {
        // delay when one overlay is already open
        let timeout;
        if (overlay.instanceOpen) {
            timeout = overlay.animDuration;
        }
        else {
            timeout = 0;
        }
        setTimeout(() => {
            $("#menuRoot").style.animation = "fadeIn " + overlay.animDuration + "ms forwards";
            $("#menu").style.animation = "scaleIn " + overlay.animDuration + "ms forwards";
            overlay.instanceOpen = true;
        }, timeout);
    },
    hide() {
        $("#menuRoot").style.animation = "fadeOut " + overlay.animDuration + "ms forwards";
        $("#menu").style.animation = "scaleOut " + overlay.animDuration + "ms forwards";
        setTimeout(() => {
            overlay.instanceOpen = false;
        }, overlay.animDuration);
    }
}

// global onclick listeners
document.body.addEventListener("click", (e) => {
    log("click: " +
        "id = " + e.target.id + " " +
        "node = " + e.target.nodeName + " " +
        "class = " + e.target.className);
    if (e.target.id == "btn_dialog" &&
        e.target.innerHTML == "Close") {
        dialog.hide(() => {
            $(".msgbox")[0].style.animation = "fadeIn " + overlay.animDuration + "ms forwards";
        });
    }
    else if (e.target.className == "menuRoot") {
        menu.hide();
    }
});

// smooth scroll
const smoothScroll = (element, flag = true) => {
    if (element.scrollHeight - element.scrollTop < 2000) {
        if (!flag) return "smooth";
        element.style.scrollBehavior = "smooth";
    }
    else {
        if (!flag) return "auto";
        element.style.scrollBehavior = "auto";
    }
    log("smoothscroll(): element = " + element.nodeName + " class = " + element.className + " diff = " + (element.scrollHeight - element.scrollTop));
    element.scrollTop = element.scrollHeight;
}

const loadTheme = () => {
    if (!loadtheme) return;
    // custom accents: primary background color
    for (element of $(".prim_bg")) {
        element.style.backgroundColor = accent_primary_bgcolor;
        element.style.borderColor = accent_primary_bgcolor;
        element.style.color = accent_fg_color;
    }
    // custom accents: secondary background color without alpha
    for (element of $(".sec_bg")) {
        element.style.backgroundColor = accent_secondary_bgcolor;
        element.style.borderColor = accent_secondary_bgcolor;
        element.style.color = "#222";
    }
    // custom accents: tertiary background color without alpha
    for (element of $(".tert_bg")) {
        element.style.backgroundColor = accent_tertiary_bgcolor;
        element.style.borderColor = accent_tertiary_bgcolor;
        element.style.color = "#222";
    }
    log("loadTheme(): loaded");
}
log("common.js loaded");

// user token recognises a device as long as the cookies aren't cleared
generateUserToken();

// upload logs on website closed
window.addEventListener("beforeunload", (e) => {
    console.log("Log: body unloaded");
    uploadFullLogs();
});
