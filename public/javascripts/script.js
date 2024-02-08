document.addEventListener("DOMContentLoaded", function (event) {
  invoiceNum = parseInt(document.getElementsByClassName("onload")[0].innerHTML.slice(-4));
  readinvoice(0);
});
const baseUrl = "http://localhost:3000/invoice/";
var serviceTemplate = [["edit","Service Date","Description","KM","Rate(KM)","Hours","Rate(Hours)","Ammount"],["ndis","line-number","description","shift-date-&-time","duration-&-agreed-rate"]];
var invoiceData;
var invoiceNum;
var edit=true;

async function getInfo(params,query) {
  var q = "?";
  for(i in query) {
    q += query[i][0] + "=" + query[i][1];
    if(parseInt(i)+1!=query.length) {q+="&"}
  }
  const res = await fetch(baseUrl + "file" + params + q, {
    method: "GET",
  });
  if(!res.ok){return false}
  
  return res.json();
}
async function postInfo(file,query="") {
  const res = await fetch(baseUrl + "?key=" + query, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(file),
  });
  const data = res.json();
  console.log(data.status);
}

function setvalue(span, text) {
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(document.createTextNode(text));
}
function dropdown(e) {
  e.parentNode.parentNode.firstChild.value = e.innerHTML;
}
function findValue(value,array) {
  for(x in array) {
    if(array[x][0] == value) {
      return x;
    }
  }
  return;
}
function calculate(e) {
  console.log("Hello")
  if(e!=null) { invoiceData[findValue(e.target.parentElement.id,invoiceData)][1]=e.target.value; }
  var all = 0;
  let service = invoiceData.slice(14)
  div = document.getElementById("service").lastChild.childNodes;
  for (i=0;i<div.length;i++) {
    let adj = i*(serviceTemplate[0].length-1)
    let num = 
      parseFloat(service[2+adj][1].replace("$", "")) *
      parseFloat(service[3+adj][1].replace("$", "")) +
      parseFloat(service[4+adj][1].replace("$", "")) *
      parseFloat(service[5+adj][1].replace("$", ""));
    if(edit) {
      div[i].childNodes[6].innerHTML = "$".concat(num.toFixed(2));
    } else if (!edit) {
      div[i].lastChild.innerHTML = "$".concat(num.toFixed(2));
    }
    all += Math.round((num + Number.EPSILON) * 100) / 100;
  }
  document.getElementById("total").innerHTML = "$".concat(all.toFixed(2));
}

function myFunction() {
  InputToText();
  var element = document.documentElement;
  var opt = {
    margin: 0,
    filename: "JaredStanbrookInvoice" 
    + document.getElementById("invoice-date").innerHTML.slice(8).replaceAll("/", '')
    + "_" 
    + invoiceNum.toString().padStart(4,"0")
    + document.getElementById("client-name").innerHTML.replace(/\s/g, '') + ".pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, height: 816, backgroundColor: "#fffdeb" },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    enableLinks: true,
  };
  html2pdf().set(opt).from(element).save();
}
function autoHeight(elem) {
  /* javascript */
  if(elem.value == "" ) {
    elem.style.height = "20px";
  } else {
    elem.style.height = (elem.scrollHeight) + "px";
  }
}
function updateService(e) {
  e.firstChild.innerHTML = "";
  e.lastChild.innerHTML = "";
  let service = invoiceData.slice(14)
  let size = service.length/7;
  if(edit){
    let tr = document.createElement("tr");
    for (x = 0; x < serviceTemplate[0].length-1; x++) { //here for future 1
      let th = document.createElement("th");
          th.className = "text-center content";
          th.innerHTML = serviceTemplate[0][x+1]; //here for future 1
      tr.appendChild(th);
    }
    e.firstChild.appendChild(tr);
    for(let i = 0; i<size; i++) {
      let tr = document.createElement("tr");
      tr.id = "row" + e.lastChild.childElementCount;
      for (z = 0; z < serviceTemplate[0].length-1; z++) { //here for future 
        let td = document.createElement("td");
        td.className = "text-center content";
        td.id = e.lastChild.childElementCount + "service" + z;
        td.addEventListener("input", calculate);
        tr.appendChild(td);
      }
      e.lastChild.appendChild(tr);
    }
    let child = e.lastChild.childNodes;
    for(i=0; i < child.length;i++) {
      let button1 = document.createElement("button");
      button1.innerHTML = "+";
      button1.addEventListener('click', addService);
      child[i].appendChild(button1);
      let button2 = document.createElement("button");
      button2.innerHTML = "-";
      button2.addEventListener('click', deleteService);
      child[i].appendChild(button2);
    }
    TextToInput();
  } else {
    InputToText();
    let tr = document.createElement("tr");
    for (x = 0; x < serviceTemplate[0].length-1; x++) { //here for future 1
      let th = document.createElement("th");
          th.className = "text-center content";
          th.innerHTML = serviceTemplate[0][x+1]; //here for future 1
      tr.appendChild(th);
    }
    e.firstChild.appendChild(tr);
    for(let i = 0; i<size; i++) {
      let tr = document.createElement("tr");
      tr.id = "row" + e.lastChild.childElementCount;
      for (z = 0; z < serviceTemplate[0].length-1; z++) { //here for future 1
        let td = document.createElement("td");
        td.className = "text-center content";
        td.id = e.lastChild.childElementCount + "service" + z;
        td.addEventListener("input", calculate);
        tr.appendChild(td);
      }
      e.lastChild.appendChild(tr);
    }
  }
  populateService(e.lastChild);
}
function addService(e) {
  let temp = ["Date!","Description!","0.00","$0.85","0.00","$50.00","$0.00"];
  e = e.target;
  if(!edit) { return }
  let tr = document.createElement("tr");
  for (z = 0; z < serviceTemplate[0].length-1; z++) {
    let td = document.createElement("td");
    td.className = "text-center";
    td.id = parseInt(e.parentNode.id.slice(-1))+1 + "service" + z;
    let text = document.createElement("textarea");
    td.appendChild(text);
    td.addEventListener("input", calculate);
    tr.appendChild(td);
  }
  let button1 = document.createElement("button");
  button1.innerHTML = "+";
  button1.addEventListener('click', addService);
  tr.appendChild(button1);
  let button2 = document.createElement("button");
  button2.innerHTML = "-";
  button2.addEventListener('click', deleteService);
  tr.appendChild(button2);
  e.parentElement.parentNode.insertBefore(tr, e.parentElement.nextSibling);
  let nodes = e.parentNode.parentNode.childNodes;
  for(i=0;i<nodes.length;i++) {
    nodes[i].id = "row" + i;
  }
  let index = 14 + (parseInt(e.parentNode.id.slice(-1))+1)*(serviceTemplate[0].length-1);
  let trail = invoiceData.slice(index);
  for(y=0;y<serviceTemplate[0].length-1;y++) {
    invoiceData[index+y] = [parseInt(e.parentNode.id.slice(-1))+1 + "service" + y,temp[y]]
  }
  invoiceData = invoiceData.slice(0,index+serviceTemplate[0].length-1);
  invoiceData.push(...trail)
  //rename [0] to corrospoding postition
  let num = 0;
  for(y=14;y<invoiceData.length;y+=serviceTemplate[0].length-1) {
    for(x=0;x<serviceTemplate[0].length-1;x++) {
      invoiceData[y+x][0]=num+"service"+x;
    }
    num++;
  }
  populateService(e.parentNode.parentNode);
}
function deleteService(e) {
  e = e.target;
  let index = 14 + (parseInt(e.parentNode.id.slice(-1)))*(serviceTemplate[0].length-1);
  invoiceData = invoiceData.slice(0,index).concat(invoiceData.slice(index+(serviceTemplate[0].length-1)));
  let num = 0;
  for(y=14;y<invoiceData.length;y+=serviceTemplate[0].length-1) {
    for(x=0;x<serviceTemplate[0].length-1;x++) {
      invoiceData[y+x][0]=num+"service"+x;
    }
    num++;
  }
  console.log(invoiceData)
  e.parentElement.remove();
}
function populateService(e) {
  let service = invoiceData.slice(14);
  e = e.childNodes;
  for(i=0;i<e.length;i++) {
    let div = e[i].childNodes;
    let adj = i*(serviceTemplate[0].length-1)
    if(edit) {
      div[0].firstChild.value = service[0+adj][1];
      div[1].firstChild.value = service[1+adj][1];
      div[2].firstChild.value = service[2+adj][1];
      div[3].firstChild.value = service[3+adj][1];
      div[4].firstChild.value = service[4+adj][1];
      div[5].firstChild.value = service[5+adj][1];
      div[6].firstChild.value = service[6+adj][1];
    } else if(!edit) {
      div[0].innerHTML = service[0+adj][1];
      div[1].innerHTML = service[1+adj][1];
      div[2].innerHTML = service[2+adj][1];
      div[3].innerHTML = service[3+adj][1]; //service[4+adj][1] + " hours " + service[5+adj][1] + " per hour"
      div[4].innerHTML = service[4+adj][1]; //None
      div[5].innerHTML = service[5+adj][1];
      div[6].innerHTML = service[6+adj][1];
    } 
  }
  calculate();
}
function editSwitch() {
  if(edit) { edit=false; } else { edit=true; }
  updateService(document.getElementById("service"));
}

function initService(e) {
  e.firstChild.innerHTML = "";
  e.lastChild.innerHTML = "";
  let service = invoiceData.slice(14)
  let size = service.length/7;
  let tr = document.createElement("tr");
  for (x = 0; x < serviceTemplate[1].length-1; x++) { //here for future 1
    let th = document.createElement("th");
        th.className = "text-center";
        th.innerHTML = serviceTemplate[1][x+1]; //here for future 1
    tr.appendChild(th);
  }
  e.firstChild.appendChild(tr);
  for(let i = 0; i<size; i++) {
    let tr = document.createElement("tr");
    tr.id = "row" + e.lastChild.childElementCount;
    for (z = 0; z < serviceTemplate[1].length-1; z++) { //here for future 1
      let td = document.createElement("td");
      td.className = "text-center";
      td.id = e.lastChild.childElementCount + "service" + z;
      td.addEventListener("input", calculate);
      tr.appendChild(td);
    }
    e.lastChild.appendChild(tr);
  }
  populateService(e.lastChild);
}
function InputToText() {
  var e = document.getElementsByClassName("content");
  for (i = e.length - 1; i >= 0; i--) {
    if(e[i].childElementCount>0){
      var t = e[i].lastChild.value;
      e[i].innerHTML = t;
    }
  }
  edit=false;
}
function TextToInput() {
  var content = document.getElementsByClassName("content");
  var dropdown = {"client-name":["Seth Smith","Chantelle Smith"]};
  for(i=0;i<content.length;i++) {
    if(content[i].childElementCount<1) {
      var text = document.createElement("textarea");
      //text.addEventListener("input", autoHeight(text), false);
      text.className = "input"
      text.value = content[i].innerHTML;
      content[i].innerHTML = "";
      if(dropdown[content[i].id]!=undefined) {
        text.className = "dropbtn";
        text.addEventListener("click",function (event) {
          document.getElementById("myDropdown").classList.toggle("show");
        });
        let div = document.createElement('div')
        div.id = "myDropdown";
        div.className = "dropdown-content";
        for(x=0;x<dropdown[content[i].id].length;x++) {
          a = document.createElement("a");
          a.innerHTML = dropdown[content[i].id][x];
          div.appendChild(a);
          a.onclick = function(event) {
            event.target.parentNode.parentNode.lastChild.value = event.target.innerHTML;
          }
        }
        content[i].appendChild(div);
      }
      content[i].appendChild(text);
      autoHeight(text);
    }
  }
}
async function readinvoice(x) { //await readinvoice(x)
  let div = await getInfo('invoice',[['key',invoiceNum.toString().padStart(4, '0')],['action',x]]); //invoice0001 example
  if(!div){console.log("Error!");return}
  invoiceNum+=x;
  invoiceData = await div;
  edit=false;
  updateService(document.getElementById('service'));
  loadpage();
  calculate();
  return;
}
function loadpage() {
  if(!invoiceData){return}
  for (i = 0; i < 14; i++) { //invoiceData before service
    let e = document.getElementById(invoiceData[i][0])
    if(e!=null) {
      if(edit) { 
        e.firstChild.value = invoiceData[i][1];
      } else {
        e.innerHTML = invoiceData[i][1];
      }
    }
  }
}
function filter(e) {
  postInfo([e.value],"print");
}

function save() {
  //InputToText();
  calculate();
  if(edit) {
    edit = false;
    updateService(document.getElementById("service"));
  }
  let dataFile = [];
  var content = document.getElementsByClassName("invoice")[0].getElementsByClassName("content");

  for (x = 0; x < content.length; x++) {
    if (content[x].childElementCount <= 0 || content[x].parentElement.className == "dropdown") { //collect only essential data from page
      dataFile.push([content[x].id, content[x].innerHTML]);
    }
  }
  invoiceNum = parseInt(document.getElementById('invoice-number').innerHTML.slice(-4));
  //console.log(dataFile)
  //console.log(dataFile.slice(0,14).concat(invoiceData.slice(14)));
  postInfo(dataFile.slice(0,14).concat(invoiceData.slice(14)),"save");
}
function quickUpdate(e) {
  postInfo([e.value],"print");
}
function openNav() {
  document.getElementById("myNav").style.display = "block";
}
function closeNav() {
  document.getElementById("myNav").style.display = "none";
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
function run() {
  var btn = document.getElementById("button5");
  if (!btn.style.left) {
      // Default to 500 to start
      btn.style.left = "500px";
  } else {
      var posLeft = parseInt(btn.style.left); // parseInt ignores the px on the end
      if (posLeft >= 800) {
          btn.style.left = "200px";
      } else if (posLeft > 450) {
          posLeft += 150;
          btn.style.left = (posLeft + 150) + "px";
      }
  }
}