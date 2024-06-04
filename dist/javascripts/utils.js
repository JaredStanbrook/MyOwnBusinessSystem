"use strict";

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function isString(value) {
    return typeof value === "string";
}

export function isObject(value) {
    return typeof value === "object";
}

export function isNull(value) {
    return value === null;
}

export function isUndefined(value) {
    return typeof value === "undefined";
}
export function indexArray(value, array) {
    for (x in array) {
        if (array[x][0] == value) {
            return x;
        }
    }
    return 0;
}
export function extractNum(value) {
    //returns String
    try {
        var num = value.match(/\d/g);
    } catch (error) {
        return null;
    }
    return num.join("");
}
export function isObjectEmpty(objectName) {
    return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object;
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function parseDMY(s) {
    var b = s.split(/\D+/);
    var d = new Date(b[2], b[1] - 1, b[0]);
    d.setFullYear(b[2]);
    return d && d.getMonth() == b[1] - 1 ? d : new Date(NaN);
}
export function findAncestor(el, sel) {
    while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
    return el;
}