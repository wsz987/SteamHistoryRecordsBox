// ==UserScript==
// @name         GM
// @namespace    
// @version      0.1
// @description  基础脚本框架(不建议取消勾选，会导致某些脚本无法运行)
// @author       软妹币玩家
// @match        *
// @enable      true
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var unsafeWindow = this;

function GM_xmlhttpRequest(option) {
    if (String(option) !== '[object Object]') return undefined
    option.method = option.method ? option.method.toUpperCase() : 'GET'
    option.data = option.data || {}
    var formData = []
    for (var key in option.data) {
        formData.push(''.concat(key, '=', option.data[key]))
    }
    option.data = formData.join('&')

    if (option.method === 'GET') {
        option.url += location.search.length === 0 ? ''.concat('?', option.data) : ''.concat('&', option.data)
    }

    var xhr = new XMLHttpRequest();
    xhr.timeout = option.timeout;
    xhr.responseType = option.responseType || 'json'
    xhr.onload = (e) => {
        if (option.onload && typeof option.onload === 'function') {
            option.onload(e.target)
        }
    };
    xhr.onerror = option.onerror;
    xhr.ontimeout = option.ontimeout;
    xhr.open(option.method, option.url, true)
    if (option.method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (option.headers) {
        Object.keys(option.headers).forEach(function (key) {
            xhr.setRequestHeader(key, option.headers[key]);
        });
    }
    xhr.send(option.method === 'POST' ? option.data : null)
}

function GM_addStyle(css) {
    try {
        let style = document.createElement('style');
        style.textContent = css;
        (document.head || document.body || document.documentElement || document).appendChild(style);
    } catch (e) {
        console.log("Error: env: adding style " + e);
    }
}

function GM_getValue(name, defaultValue) {
    let value = window.localStorage.getItem(name)
    if (!value) {
        return defaultValue;
    }
    let type = value[0];
    value = value.substring(1);
    switch (type) {
        case 'b':
            return value == 'true';
        case 'n':
            return Number(value);
        case 'o':
            try {
                return JSON.parse(value);
            } catch (e) {
                console.log("Error: env: GM_getValue " + e);
                return defaultValue;
            }
            default:
                return value;
    }
}

function GM_setValue(name, value) {
    let type = (typeof value)[0];
    switch (type) {
        case 'o':
            try {
                value = type + JSON.stringify(value);
            } catch (e) {
                console.log("Error: env: GM_setValue typeof ?Object" + e);
                return;
            }
            break;
        default:
            value = type + value;
    }
    try {
        if (typeof name !== 'string') JSON.stringify(name)
        localStorage.setItem(name, value);
    } catch (e) {
        console.log("Error: env: GM_setValue saveing" + e);
    }
}
