"use strict";

import * as utils from "./utils";

document.addEventListener("DOMContentLoaded", function (event) {
    invoicePath = document.getElementsByClassName("onload")[0].innerHTML.split(",");
    (async function () {
        config = await getReq({
            key: "/invoices/config",
            query: new URLSearchParams({}),
        });
    })();
    //Init Config Files

    currentInvoice();
    document.getElementById("status-btn").addEventListener("click", statusSwitch, false);
    document.getElementById("type-btn").addEventListener("click", typesSwitch, false);
    document.getElementById("download-btn").addEventListener("click", downloadInvoice, false);
    document.getElementById("new-btn").addEventListener("click", newInvoice, false);
    document.getElementById("delete-btn").addEventListener("click", deleteInvoice, false);
    document.getElementById("save-btn").addEventListener("click", saveInvoice, false);
    document.getElementById("previous-btn").addEventListener("click", previousInvoice, false);
    document.getElementById("next-btn").addEventListener("click", nextInvoice, false);
    document.getElementById("edit-btn").addEventListener("click", editSwitch, false);
    document.getElementById("pallette-btn").addEventListener("click", palletteSwitch, false);
    document.getElementById("form-btn").addEventListener("click", formOpen, false);
    document.getElementById("myNavclose-btn").addEventListener("click", formClose, false);
    document.getElementById("formSubmit-btn").addEventListener("click", formSubmit, false);
    //document.getElementById("filter").addEventListener("input", filter, false);
});

const BASE_URL = window.location.href;
var config;
var invoiceData;
var invoicePath;
var edit = false;

async function getReq(params = {}) {
    if (utils.isObjectEmpty(params.query) || !utils.isString(params.key)) {
        console.log("Type Error");
        return 0;
    }
    try {
        const response = await fetch(BASE_URL + params.key + "?" + params.query.toString(), {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
            /*
            headers: {
                Accept: "text/*",
            },
            */
        });
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
async function postReq(params = {}) {
    if (utils.isNull(params.data) || !utils.isString(params.key)) {
        console.log("Type Error");
        return 0;
    }
    try {
        const response = await fetch(BASE_URL + params.key + "?" + params.query.toString(), {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer-when-downgrade", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(params.data), // body data type must match "Content-Type" header
        });
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    } catch (error) {
        console.error("Error:", error);
        return 0;
    }
}
async function putReq(params = {}) {
    if (utils.isNull(params.data) || !utils.isString(params.key)) {
        console.log("Type Error");
        return 0;
    }
    try {
        const response = await fetch(BASE_URL + params.key + "?" + params.query.toString(), {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer-when-downgrade", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(params.data), // body data type must match "Content-Type" header
        });
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
async function deleteReq(params = {}) {
    if (!utils.isString(params.key)) {
        console.log("Type Error");
        return 0;
    }
    try {
        const response = await fetch(BASE_URL + params.key, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        });
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

function downloadInvoice() {
    if (edit) {
        editSwitch();
    }
    document.body.style.overflow = "hidden";
    var element = document.documentElement;
    let date = invoiceData.date.toLocaleDateString().split("/").reverse().join("");
    var opt = {
        margin: 0,
        filename: date + "_JaredStanbrook_" + invoiceData.invoice_id.replace(/\s/g, "") + ".pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
            scale: 3,
            //backgroundColor: "#000",
            width: 3508 / 2.5,
            height: 2480 / 2.5,
            x: 50,
            y: 0,
            backgroundColor: "#fffdeb",
        },
        jsPDF: { orientation: "l", unit: "in", format: "A4", orientation: "landscape" },
        enableLinks: true,
    };
    html2pdf().set(opt).from(element).save();
}
function adjustInput(e) {
    e.style.height = "auto";
    e.style.height = e.scrollHeight + "px";
}
function populateTable(e, id) {
    const filteredObjects = config.table_field_configs.filter(
        (obj) => obj.table_config_id === id && obj.field_type != "button"
    );
    filteredObjects.sort((a, b) => a.position - b.position);
    let target = e.lastChild.childNodes;
    for (let i = 0; i < target.length; i++) {
        let div = target[i].childNodes;
        for (let j = 0; j < filteredObjects.length; j++) {
            let value;
            let data = invoiceData[config.table_configs[id].data][i];
            switch (filteredObjects[j].field_value_type) {
                case "template":
                    switch (filteredObjects[j].name) {
                        case "km":
                            value = data.km + "km @ " + data.km_rate + " per km";
                            break;
                        case "hour":
                            value = data.hour + " hours @ " + data.hour_rate + " per hour";
                            break;
                        default:
                            value = "Unknown Template!";
                    }
                    break;
                case "number":
                    value = data[filteredObjects[j].name];
                    break;
                case "date":
                    //Check that date is date object!
                    if (typeof data[filteredObjects[j].name] == "string") {
                        data[filteredObjects[j].name] = utils.parseDMY(
                            data[filteredObjects[j].name]
                        );
                    }
                    value = data[filteredObjects[j].name].toLocaleDateString();
                    break;
                case "text":
                    div[j].innerHTML = value;
                    break;
                default:
                    value = "Unknown Field Value Type! = " + filteredObjects[j].field_value_type;
            }
            if (filteredObjects[j].field_type == "text") {
                div[j].innerHTML = value;
            }
            if (filteredObjects[j].field_type == "input") {
                div[j].firstChild.value = value;
                div[j].firstChild.setAttribute(
                    "style",
                    "height:" + div[j].firstChild.scrollHeight + "px;overflow-y:hidden;"
                );
            }
        }
    }
    calculateTable(e, id);
}
function renderTable(e, id) {
    //Clear Old Table
    e.innerHTML = "";
    //Prepare Table Structure
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    //Collect, Filter, and Sort Data for table
    const filteredObjects = config.table_field_configs.filter(
        (obj) => obj.table_config_id === id && obj.field_type != "button"
    );
    filteredObjects.sort((a, b) => a.position - b.position);
    const buttonObjects = config.table_field_configs.filter(
        (obj) => obj.table_config_id === id && obj.field_type === "button"
    );
    buttonObjects.sort((a, b) => a.position - b.position);
    //Generate Heading of Table
    let heading = document.createElement("tr");
    for (let x = 0; x < filteredObjects.length; x++) {
        let th = document.createElement("th");
        th.className = "text-center";
        th.innerHTML = filteredObjects[x].label;
        heading.appendChild(th);
    }
    thead.appendChild(heading);
    e.appendChild(thead);

    //Generate Body of Table
    let row = document.createElement("tr");
    for (let z = 0; z < filteredObjects.length; z++) {
        let td = document.createElement("td");
        td.className = "text-center";
        if (filteredObjects[z].field_type == "input") {
            let text = document.createElement("textarea");
            text.id = filteredObjects[z].name;
            text.className = "input";
            td.appendChild(text);
        }
        row.appendChild(td);
    }
    if (buttonObjects.length) {
        for (let x = 0; x < buttonObjects.length; x++) {
            let button = document.createElement("button");
            button.id = buttonObjects[x].name;
            button.innerHTML = buttonObjects[x].label;
            row.appendChild(button);
        }
    }
    //Make Clone of Row for total ammount of entries
    for (let i = 0; i < invoiceData.service.length; i++) {
        let clone = row.cloneNode(true);
        clone.id = i;
        tbody.appendChild(clone);
    }
    //Update InvoiceData and Calculate new total on every input
    tbody.addEventListener("input", (event) => {
        invoiceData.service[utils.findAncestor(event.target, "tr").id][event.target.id] =
            event.target.value;
        adjustInput(event.target);
        calculateTable(e, id);
    });
    //Set Event Listner to only the buttons
    tbody.getElementsByTagName("button").forEach(function (elem) {
        elem.addEventListener("click", (event) => {
            let row_n = parseInt(event.target.parentNode.id);
            switch (event.target.id) {
                case "add_row":
                    console.log("Add Row!");
                    addRow(e, id, row_n);
                    break;
                case "remove_row":
                    console.log("Remove Row!");
                    deleteRow(e, id, row_n);
                    break;
                default:
                    console.log("Unknown Button!");
            }
        });
    });
    e.appendChild(tbody);
    populateTable(e, id);
}
function calculateTable(e, id) {
    const filteredObjects = config.table_field_configs.filter(
        (obj) => obj.table_config_id === id && obj.field_type === "total"
    );
    var all = 0;
    let div = e.lastChild.childNodes;
    for (let i = 0; i < div.length; i++) {
        let num =
            parseFloat(invoiceData.service[i].km) * parseFloat(invoiceData.service[i].km_rate) +
            parseFloat(invoiceData.service[i].hour) * parseFloat(invoiceData.service[i].hour_rate);

        div[i].childNodes[filteredObjects[0].position - 1].innerHTML = "$".concat(num.toFixed(2));
        all += Math.round((num + Number.EPSILON) * 100) / 100;
    }
    document.getElementById("total").innerHTML = "$".concat(all.toFixed(2));
}
function addRow(e, id, num) {
    if (invoiceData.service.length >= 7) {
        return;
    }
    invoiceData.service.splice(num + 1, 0, config.emptyService);
    renderTable(e, id);
}
function deleteRow(e, id, num) {
    if (invoiceData.service.length < 1) {
        return;
    }
    invoiceData.service.splice(num, 1);
    renderTable(e, id);
}
function statusSwitch() {
    if (!this.innerHTML) {
        return;
    }
    if (this.innerHTML.toLowerCase() == "incomplete") {
        this.innerHTML = "Complete";
        invoiceData.status = "complete";
    } else if (this.innerHTML.toLowerCase() == "complete") {
        this.innerHTML = "Incomplete";
        invoiceData.status = "incomplete";
    }
}
function typesSwitch() {
    //Code TO Change Type of Invoice!
    if (!this.innerHTML) {
        return;
    }
    if (this.innerHTML.toLowerCase() == "ndis") {
        this.innerHTML = "ABN";
        document.getElementById("type").innerHTML = "ABN:";
        invoiceData["invoice_type"] = "abn";
    } else if (this.innerHTML.toLowerCase() == "abn") {
        this.innerHTML = "NDIS";
        document.getElementById("type").innerHTML = "NDIS:";
        invoiceData["invoice_type"] = "ndis";
    }
}
function palletteSwitch(e) {
    if (e.target.innerHTML == "Dark!") {
        const html = document.getElementsByTagName("*");
        html.forEach((element) => {
            element.style.background = "#000";
            element.style.color = "#fff";
        });
        document.getElementsByClassName("panel-heading").forEach((e) => {
            e.style.background = "#fff";
            e.firstChild.style.background = "#fff";
            e.firstChild.style.color = "#000";
        });
        e.target.innerHTML = "Light!";
    } else if (e.target.innerHTML == "Light!") {
        const html = document.getElementsByTagName("*");
        html.forEach((element) => {
            element.style.background = "#fff";
            element.style.color = "#000";
        });
        document.getElementsByClassName("panel-heading").forEach((e) => {
            e.style.background = "#000";
            e.firstChild.style.background = "#000";
            e.firstChild.style.color = "#fff";
        });
        e.target.innerHTML = "Dark!";
    }
}
function editSwitch() {
    edit = !edit;
    let service = document.getElementById("service_table");
    let content = document.getElementsByClassName("content");
    if (edit) {
        TextToInput(content);
        renderTable(service, 1);
    } else {
        calculateTable(service, 2);
        collectTable(service);
        InputToText(content);
        renderTable(service, 2);
    }
}

function collectTable(table) {
    Array.from(table.lastChild.children).forEach((row, index) => {
        Array.from(row.children).forEach((item) => {
            if (item.childElementCount > 0) {
                let t = item.lastChild.value;
                if (item.id == "service_date") {
                    t = utils.parseDMY(t);
                }
                invoiceData.service[index][item.id] = t;
            }
        });
    });
}
function InputToText(content) {
    for (let i = content.length - 1; i >= 0; i--) {
        if (content[i].childElementCount > 0) {
            let t = content[i].lastChild.value;
            content[i].innerHTML = t;
            if (content[i].id == "date") {
                t = utils.parseDMY(t);
                content[i].innerHTML = t.toDateString();
            }
            invoiceData[content[i].id] = t;
        }
    }
}
function TextToInput(content) {
    for (let i = 0; i < content.length; i++) {
        if (content[i].childElementCount < 1) {
            var text = document.createElement("textarea");
            text.className = "input";
            text.value = invoiceData[content[i].id];
            if (content[i].id == "date") {
                text.value = invoiceData[content[i].id].toLocaleDateString();
            }
            content[i].innerHTML = "";
            content[i].appendChild(text);
        }
    }
}
async function readInvoice(id) {
    if (!id) {
        return;
    }
    if (edit) {
        editSwitch();
    }
    let filterfield = document.getElementById("filter").value;
    let div = await getReq({
        key: "/invoices/" + id,
        query: new URLSearchParams({
            field: ["clientName"],
            operator: ["=="],
            value: [filterfield],
        }),
    }); //invoice0001 example getReq("invoice", [["key", key],["field", ["clientName"]],["operator", ["=="]],["value", [filterField]],]);
    if (!div) {
        console.log("Error!");
        return;
    }
    invoiceData = await div.file;
    invoicePath = await div.path;
    loadInvoice();
    renderTable(document.getElementById("service_table"), 2); //Get Table Element
    calculateTable(document.getElementById("service_table"), 2);
    return;
}
function loadInvoice() {
    if (!invoiceData) {
        return;
    }
    //TODO Move Invoice Data Sterilaztion into Invoice Data fetching function! ->

    //Adjust InvoiceData Service Data Variable to be in Date Format, Before going further.
    invoiceData.date = new Date(invoiceData.date);
    for (const i in invoiceData.service) {
        invoiceData.service[i].service_date = new Date(invoiceData.service[i].service_date);
    }
    document.getElementById("type").innerHTML = invoiceData.invoice_type.toUpperCase() + ":";
    if (!invoiceData.invoice_type) {
        invoiceData.invoice_type = "NDIS";
    }
    document.getElementById("type-btn").innerHTML = invoiceData.invoice_type.toUpperCase();

    if (!invoiceData.status) {
        invoiceData.status = "incomplete";
    }
    document.getElementById("status-btn").innerHTML = utils.capitalizeFirstLetter(
        invoiceData.status
    );
    // All Apart of the sterilization! <-
    let temp = utils.deepCopy(invoiceData); //makes duplicate of invoiceData
    delete temp["service"];
    fillForm(temp);
}
function fillForm(dict) {
    //TODO relating to dynamic form content field formatting, make sure each element is formated correctly.
    for (const key in dict) {
        if (dict.hasOwnProperty(key)) {
            let e = document.getElementById(key);
            if (e != null) {
                if (edit) {
                    e.firstChild.value = dict[key];
                } else {
                    e.innerHTML = dict[key];
                    if (e.id == "date") {
                        e.innerHTML = invoiceData.date.toDateString();
                    }
                }
            }
        }
    }
}
function filter() {
    currentInvoice();
}
function previousInvoice() {
    readInvoice(invoicePath[0]);
}
function currentInvoice() {
    readInvoice(invoicePath[1]);
}
function nextInvoice() {
    readInvoice(invoicePath[2]);
}
async function newInvoice() {
    //InputToText();
    //saveInvoice();

    let obj = await getReq({
        key: "/clients/" + invoiceData.client_fullname + "/latest",
        query: new URLSearchParams({}),
    });
    let temp = utils.deepCopy(config.emptyInvoice);
    temp.invoice_id =
        obj.file.client_fullname.replace(/\s+/g, "") +
        (parseInt(utils.extractNum(obj.file.invoice_id)) + 1);
    temp.invoice_type = obj.file.invoice_type;
    temp.client_id = obj.file.client_id;
    temp.client_fullname = obj.file.client_fullname;
    temp.client_address = obj.file.client_address;
    temp.client_number = obj.file.client_number;
    let res = await postReq({
        data: temp,
        key: "/invoices",
        query: new URLSearchParams({
            path: true,
        }),
    });
    //TODO ADD ERROR CHECKING
    temp._id = res.path[1];
    invoiceData = temp;
    invoicePath = res.path;
    loadInvoice();
    renderTable(document.getElementById("service_table"), 2);
    calculateTable(document.getElementById("service_table"), 2);
}
async function deleteInvoice() {
    let div = await deleteReq({
        key: "/invoices/" + invoiceData._id,
        query: new URLSearchParams({}),
    });
    previousInvoice();
}
function saveInvoice() {
    if (edit) {
        editSwitch();
    }

    putReq({
        data: invoiceData,
        key: "/invoices/" + invoiceData.invoice_id,
        query: new URLSearchParams({}),
    });
}
function formOpen() {
    document.getElementById("service-form").style.display = "block";
    let form = document.getElementsByName("service-form")[0];
    renderForm(form);
    /*
    const form = document.getElementById("supportCategory").addEventListener("click", function () {
        document.getElementById("outcomeDomain").value = "";
    });
    */
}
function renderForm(form) {
    let panel = document.createElement("div");
    panel.setAttribute("class", "panel");
    let panel_heading = document.createElement("div");
    panel_heading.setAttribute("class", "panel-heading");
    let panel_body = document.createElement("div");
    panel_body.setAttribute("class", "panel-body");
    let coloumn = document.createElement("dl");
    coloumn.setAttribute("class", "dl-horizontal-2 ");

    const filtered_form_field_configs = config.form_field_configs.filter(
        (x) => x.form_config_id == config.form_configs["service-form"]
    );
    const sorted_form_field_configs = filtered_form_field_configs.sort(
        (a, b) => a.position - b.position
    );
    for (const item in sorted_form_field_configs) {
        let dt = document.createElement("dt");
        dt.innerHTML = sorted_form_field_configs[item].label + ":";
        let dd = document.createElement("dd");
        var e = document.createElement(sorted_form_field_configs[item].field_type);
        if (sorted_form_field_configs[item].field_value_type) {
            e.setAttribute("type", sorted_form_field_configs[item].field_value_type);
        }
        e.setAttribute("name", sorted_form_field_configs[item].name);
        if (sorted_form_field_configs[item].field_type == "input") {
            e.setAttribute("placeholder", "Fuck Off");
            if (sorted_form_field_configs[item].field_value_type == "number") {
                e.setAttribute("placeholder", "Enter a number");
            }
        }
        for (const key in sorted_form_field_configs[item].options) {
            var option = document.createElement("option");
            option.text = sorted_form_field_configs[item].options[key];
            e.appendChild(option);
        }
        dd.appendChild(e);
        coloumn.appendChild(dt);
        coloumn.appendChild(dd);
    }
    panel_body.appendChild(coloumn);
    panel.appendChild(panel_heading);
    panel.appendChild(panel_body);
    form.appendChild(panel);
}
function formClose() {
    document.getElementById("service-form").style.display = "none";
}
function formSubmit() {
    const form = document.querySelector("form");
    const params = Array.from(new FormData(form));
    const json = Object.assign(...Array.from(params, ([x, y]) => ({ [x]: y })));

    let empty = utils.deepCopy(config.emptyService);
    empty.description = json.item_name + " - " + json.item_level;
    empty.hour = json.end_time - json.start_time;
    empty.hour_rate = parseFloat(json.item_rate);
    empty.km = parseFloat(json.km);
    empty.km_rate = parseFloat(json.km_rate);
    empty.line_number = json.item_number;
    empty.service_date = utils.parseDMY(json.start_date);
}
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (let i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};
