"use strict";

import * as utils from "./utils";

document.addEventListener("DOMContentLoaded", function (event) {
    invoicePath = document.getElementsByClassName("onload")[0].innerHTML.split(",");
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

const BASE_URL = "http://localhost:80/mobs";
var invoiceData;
var invoicePath;
var edit = false;

const form_configs = { "service-form": 1, client: 2 };

const form_field_configs = [
    {
        form_config_id: 1,
        name: "item_number",
        label: "Item Number",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 2,
        required: true,
    },
    {
        form_config_id: 1,
        name: "item_name",
        label: "Item Name",
        field_type: "select",
        field_value_type: null,
        options: ["Yes", "No"],
        position: 1,
        required: true,
    },
];
const table_configs = {
    1: { title: "edit", data: "service" },
    2: { title: "ndis", data: "service" },
};

const table_field_configs = [
    {
        table_config_id: 1,
        name: "service_date",
        label: "Service Date",
        field_type: "input",
        field_value_type: "date",
        options: null,
        position: 1,
        required: true,
    },
    {
        table_config_id: 1,
        name: "line_number",
        label: "Line Number",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 2,
        required: true,
    },
    {
        table_config_id: 1,
        name: "description",
        label: "Description",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 3,
        required: true,
    },
    {
        table_config_id: 1,
        name: "km",
        label: "KM",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 4,
        required: true,
    },
    {
        table_config_id: 1,
        name: "km_rate",
        label: "Rate(KM)",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 5,
        required: true,
    },
    {
        table_config_id: 1,
        name: "hour",
        label: "Hours",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 6,
        required: true,
    },
    {
        table_config_id: 1,
        name: "hour_rate",
        label: "Rate(Hours)",
        field_type: "input",
        field_value_type: "number",
        options: null,
        position: 7,
        required: true,
    },
    {
        table_config_id: 1,
        name: "ammount",
        label: "Ammount",
        field_type: "total",
        field_value_type: "number",
        options: null,
        position: 8,
        required: true,
    },
    {
        table_config_id: 2,
        name: "service_date",
        label: "Service Date",
        field_type: "text",
        field_value_type: "date",
        options: null,
        position: 1,
        required: true,
    },
    {
        table_config_id: 2,
        name: "line_number",
        label: "Line Number",
        field_type: "text",
        field_value_type: "number",
        options: null,
        position: 2,
        required: true,
    },
    {
        table_config_id: 2,
        name: "description",
        label: "Description",
        field_type: "text",
        field_value_type: "number",
        options: null,
        position: 3,
        required: true,
    },
    {
        table_config_id: 2,
        name: "km_rate",
        label: "Distance & Agreed Rate",
        field_type: "text",
        field_value_type: "template",
        options: null,
        position: 4,
        required: true,
    },
    {
        table_config_id: 2,
        name: "km_rate",
        label: "Duration & Agreed Rate",
        field_type: "text",
        field_value_type: "template",
        options: null,
        position: 5,
        required: true,
    },
    {
        table_config_id: 2,
        name: "ammount",
        label: "Ammount",
        field_type: "text",
        field_value_type: "number",
        options: null,
        position: 6,
        required: true,
    },
];
const serviceHeadings = [
    [
        "edit",
        "Service Date",
        "Line Number",
        "Description",
        "KM",
        "Rate(KM)",
        "Hours",
        "Rate(Hours)",
        "Ammount",
    ],
    [
        "ndis",
        "Service Date",
        "Line Number",
        "Description",
        "Distance & Agreed Rate",
        "Duration & Agreed Rate",
        "Ammount",
    ],
];
const emptyService = {
    service_date: new Date("2024-01-01T16:00:00.000Z"),
    line_number: "",
    description: "",
    km: 0,
    km_rate: 0.85,
    hour: 0,
    hour_rate: 50,
};
const emptyInvoice = {
    invoice_id: "",
    invoice_type: "abn",
    date: "2024-01-31T16:00:00.000Z",
    client_id: "",
    client_fullname: "Kerry Hickman",
    client_address: "PO BOX 25 Bentley WA 6982 Australia",
    client_number: "12345444",
    user_fullname: "Jared Stanbrook",
    user_bsb: "036087",
    user_account: "886813",
    user_bank: "Westpac Banking Corporation",
    user_abn: "62385109727",
    user_phone: "0418 407 644",
    user_email: "Jared.Stanbrook@outlook.com",
    user_address: "19 Hopkins Pl, Waikiki WA 6169",
    service: [
        {
            service_date: "2024-01-01T16:00:00.000Z",
            line_number: "",
            description: "Assistance with Social and Community Event",
            km: 0,
            km_rate: 0.85,
            hour: 0,
            hour_rate: 50,
        },
    ],
    status: "incomplete",
};
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

function dropdown(e) {
    e.parentNode.parentNode.firstChild.value = e.innerHTML;
}
function calculate(e) {
    var all = 0;
    let div = document.getElementById("service_table").lastChild.childNodes;
    for (let i = 0; i < div.length; i++) {
        let num =
            parseFloat(invoiceData.service[i].km) * parseFloat(invoiceData.service[i].km_rate) +
            parseFloat(invoiceData.service[i].hour) * parseFloat(invoiceData.service[i].hour_rate);
        if (edit) {
            div[i].childNodes[7].innerHTML = "$".concat(num.toFixed(2));
        } else if (!edit) {
            div[i].lastChild.innerHTML = "$".concat(num.toFixed(2));
        }
        all += Math.round((num + Number.EPSILON) * 100) / 100;
    }
    document.getElementById("total").innerHTML = "$".concat(all.toFixed(2));
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
function adjustInput(list, table) {
    for (let i = 0; i < list.length; i++) {
        list[i].firstChild.style.height = list[i].firstChild.scrollHeight + "px";
        if (list[i].closest("div").classList.contains("title")) {
            list[i].firstChild.style.width = list[i].firstChild.value.length + "ch";
            list[i].firstChild.style.height = "22px";
        }
    }
    for (let i = 0; i < table.length; i++) {
        table[i].style.width = table[i].value.length + "ch";
        table[i].style.height = table[i].scrollHeight + "px";
    }
}
function editService(e) {
    //Edit View
    //Service Headings
    e.firstChild.innerHTML = "";
    e.lastChild.innerHTML = "";
    let tr = document.createElement("tr");
    for (let x = 0; x < serviceHeadings[0].length - 1; x++) {
        let th = document.createElement("th");
        th.className = "text-center";
        th.innerHTML = serviceHeadings[0][x + 1];
        tr.appendChild(th);
    }
    e.firstChild.appendChild(tr);
    let template = [
        "service_date",
        "line_number",
        "description",
        "km",
        "km_rate",
        "hour",
        "hour_rate",
    ];
    //Service Table
    let table = [];
    for (let i = 0; i < invoiceData.service.length; i++) {
        let tr = document.createElement("tr");
        tr.id = "row" + e.lastChild.childElementCount;
        for (let z = 0; z < serviceHeadings[0].length - 1; z++) {
            //here for future
            let td = document.createElement("td");
            td.className = "text-center";
            if (z < serviceHeadings[0].length - 2) {
                td.id = template[z];
            }
            td.addEventListener("input", calculate);
            tr.appendChild(td);
            let text = document.createElement("textarea");
            text.className = "input";
            td.appendChild(text);
            table.push(text);
        }
        e.lastChild.appendChild(tr);
    }
    //Add + and - Buttons
    let child = e.lastChild.childNodes;
    for (let i = 0; i < child.length; i++) {
        let button1 = document.createElement("button");
        button1.innerHTML = "+";
        button1.addEventListener("click", addService);
        child[i].appendChild(button1);
        let button2 = document.createElement("button");
        button2.innerHTML = "-";
        button2.addEventListener("click", deleteService);
        child[i].appendChild(button2);
    }
    populateService(e.lastChild);
    //adjustInput(content, table);
    return;
}
function showService(e, id) {
    e.firstChild.innerHTML = "";
    e.lastChild.innerHTML = "";
    // Non-Edit View
    let tr = document.createElement("tr");
    const filteredObjects = table_field_configs.filter((obj) => obj.table_config_id === id);
    filteredObjects.sort((a, b) => a.position - b.position);
    for (let x = 0; x < filteredObjects.length; x++) {
        let th = document.createElement("th");
        th.className = "text-center";
        th.innerHTML = filteredObjects[x].label;
        tr.appendChild(th);
    }
    e.firstChild.appendChild(tr);
    for (let i = 0; i < invoiceData.service.length; i++) {
        let tr = document.createElement("tr");
        tr.id = "row" + e.lastChild.childElementCount;
        for (let z = 0; z < filteredObjects.length; z++) {
            let td = document.createElement("td");
            td.className = "text-center";
            td.addEventListener("input", calculate);
            tr.appendChild(td);
        }
        e.lastChild.appendChild(tr);
    }
    populateService(e.lastChild, id);
}
function addService(e) {
    if (!edit || invoiceData.service.length >= 7) {
        return;
    }
    e = e.target;
    let tr = document.createElement("tr");
    for (let z = 0; z < serviceHeadings[0].length - 1; z++) {
        let td = document.createElement("td");
        td.className = "text-center";
        let text = document.createElement("textarea");
        td.appendChild(text);
        td.addEventListener("input", calculate);
        tr.appendChild(td);
    }
    let button1 = document.createElement("button");
    button1.innerHTML = "+";
    button1.addEventListener("click", addService);
    tr.appendChild(button1);
    let button2 = document.createElement("button");
    button2.innerHTML = "-";
    button2.addEventListener("click", deleteService);
    tr.appendChild(button2);
    e.parentElement.parentNode.insertBefore(tr, e.parentElement.nextSibling);
    let nodes = e.parentNode.parentNode.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].id = "row" + i;
    }
    invoiceData.service.splice(parseInt(e.parentNode.id.slice(-1)) + 1, 0, {
        service_date: new Date("2024-01-01T16:00:00.000Z"),
        description: "Daily Personal Activities - Weekday Daytime",
        km: 0.0,
        km_rate: 0.0,
        hour: 0.0,
        hour_rate: 50,
        total: 0.0,
    });
    populateService(e.parentNode.parentNode);
}
function deleteService(e) {
    if (invoiceData.service.length > 1) {
        e = e.target;
        invoiceData.service.splice(parseInt(e.parentNode.id.slice(-1)), 1);
        e.parentElement.remove();
    }
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
function populateService(e, id) {
    const filteredObjects = table_field_configs.filter((obj) => obj.table_config_id === id);
    filteredObjects.sort((a, b) => a.position - b.position);
    e = e.childNodes;
    for (let i = 0; i < e.length; i++) {
        let div = e[i].childNodes;
        for (let j = 0; j < filteredObjects.length; j++) {
            let value;
            let data = invoiceData[table_configs[id].data][i];
            if (filteredObjects[j].field_value_type == "template") {
                value = "Template > " + data[filteredObjects[j].name];
            }
            if (filteredObjects[j].field_value_type == "number") {
                value = data[filteredObjects[j].name];
            }
            if (filteredObjects[j].field_value_type == "date") {
                value = data[filteredObjects[j].name].toLocaleDateString();
            }
            if (filteredObjects[j].field_type == "text") {
                div[j].innerHTML = value;
            }
            if (filteredObjects[j].field_type == "input") {
                div[j].innerHTML = value;
            }
        }
        continue;
        if (edit) {
            //Edit View
            div[0].firstChild.value = invoiceData.service[i].service_date.toLocaleDateString();
            div[1].firstChild.value = invoiceData.service[i].line_number;
            div[2].firstChild.value = invoiceData.service[i].description;
            div[3].firstChild.value = invoiceData.service[i].km;
            div[4].firstChild.value = invoiceData.service[i].km_rate;
            div[5].firstChild.value = invoiceData.service[i].hour;
            div[6].firstChild.value = invoiceData.service[i].hour_rate;
            //div[6].firstChild.value = invoiceData.service[i].total;
        } else if (!edit) {
            //Non-Edit View
            div[0].innerHTML = invoiceData.service[i].service_date.toDateString();
            div[1].innerHTML = invoiceData.service[i].line_number;
            div[2].innerHTML = invoiceData.service[i].description;
            div[3].innerHTML =
                invoiceData.service[i].km + "km @ " + invoiceData.service[i].km_rate + " per km";
            div[4].innerHTML =
                invoiceData.service[i].hour +
                " hours @ " +
                invoiceData.service[i].hour_rate +
                " per hour";
            //div[3].innerHTML = invoiceData.service[i].kmRate;
            //div[4].innerHTML = invoiceData.service[i].hours; //None
            //div[5].innerHTML = invoiceData.service[i].hoursRate;
            //div[6].innerHTML = invoiceData.service[i].total;
        }
    }
    calculate();
}
function editSwitch() {
    edit = !edit;
    let service = document.getElementById("service_table");
    let content = document.getElementsByClassName("content");
    if (edit) {
        TextToInput(content);
        showService(service, 1);
    } else {
        calculate();
        collectTable(service);
        InputToText(content);
        showService(service, 2);
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
                t = utils.parseDMY(t); //utils.parseDMY(t) t.toDateString()
                content[i].innerHTML = t.toDateString();
            }
            invoiceData[content[i].id] = t;
        }
    }
}
function TextToInput(content) {
    //let dropdown = { "client-name": ["Seth Smith", "Chantelle Smith"] };
    for (let i = 0; i < content.length; i++) {
        if (content[i].childElementCount < 1) {
            var text = document.createElement("textarea");
            text.className = "input";
            text.value = invoiceData[content[i].id];
            if (content[i].id == "date") {
                text.value = invoiceData[content[i].id].toLocaleDateString();
            }
            content[i].innerHTML = "";
            /*
            if (dropdown[content[i].id] != undefined) {
                text.className = "dropbtn";
                text.addEventListener("click", function (event) {
                    document.getElementById("myDropdown").classList.toggle("show");
                });
                let div = document.createElement("div");
                div.id = "myDropdown";
                div.className = "dropdown-content";
                for (let x = 0; x < dropdown[content[i].id].length; x++) {
                    a = document.createElement("a");
                    a.innerHTML = dropdown[content[i].id][x];
                    div.appendChild(a);
                    a.onclick = function (event) {
                        event.target.parentNode.parentNode.lastChild.value = event.target.innerHTML;
                    };
                }
                content[i].appendChild(div);
            }
            */
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
    });
    if (!div) {
        console.log("Error!");
        return;
    }
    invoiceData = await div.file;
    invoicePath = await div.path;
    loadInvoice();
    showService(document.getElementById("service_table"), 2); //Get Table Element
    calculate();
    return;
}
function loadInvoice() {
    if (!invoiceData) {
        return;
    }
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

    let temp = utils.deepCopy(invoiceData); //makes duplicate of invoiceData
    delete temp["service"];
    for (const key in temp) {
        if (temp.hasOwnProperty(key)) {
            let e = document.getElementById(key);
            if (e != null) {
                if (edit) {
                    e.firstChild.value = temp[key];
                } else {
                    e.innerHTML = temp[key];
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
    let temp = utils.deepCopy(emptyInvoice);
    temp.invoice_id =
        obj.file.client_fullname.replace(/\s+/g, "") +
        (parseInt(utils.extractNum(obj.file.invoice_id)) + 1);
    temp.invoice_type = obj.file.invoice_type;
    temp.client_id = obj.file.client_id;
    temp.client_fullname = obj.file.client_fullname;
    temp.client_address = obj.file.client_address;
    temp.client_number = obj.file.client_number;
    await postReq({
        data: temp,
        key: "/invoices/" + temp.invoice_id,
        query: new URLSearchParams({}),
    });
    invoiceData = temp;
    invoicePath = [obj.path[1], "", ""];
    loadInvoice();
    showService(document.getElementById("service"));
    calculate();
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

    const filtered_form_field_configs = form_field_configs.filter(
        (x) => x.form_config_id == form_configs["service-form"]
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

    let empty = utils.deepCopy(emptyService);
    empty.description = json.item_name + " - " + json.item_level;
    empty.hour = json.end_time - json.start_time;
    empty.hour_rate = parseFloat(json.item_rate);
    empty.km = parseFloat(json.km);
    empty.km_rate = parseFloat(json.km_rate);
    empty.line_number = json.item_number;
    empty.service_date = utils.parseDMY(json.start_date);
    console.log(empty);
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
