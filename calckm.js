const fs = require('fs');

var startKM = 213385; //213,385km
var currentKM = 241345; //241,345km
var startDate = "1/1/23";
var currentDate = "1/2/24";
var kmlist = []
var total = 0;
var tdp = 0;

var files = fs.readdirSync(__dirname);
for(var i = files.length; i--;) {
    if(!files[i].includes("invoice")) {
        files.splice(i, 1);
    }
}
function readInvoice() {
    for(let i = 0; i<files.length; i++) {
        try {
            const data = fs.readFileSync(files[i], "utf-8");
            var obj = JSON.parse(data);
        } catch (error) {
            console.error("Error reading JSON file:", error);
        }
        for(x=0;x<obj.length;x++) {
            if(obj[x][0].substring(1) == "service2") {
                kmlist.push([obj[x-2][1],obj[x][1]]);
                let n = parseFloat(obj[x][1]);
                total += n;
            }
        }
        //if(obj[2][1] == "Seth Smith") {
    }
}
readInvoice();
total = 0;

kmlist = kmlist.sort(function(a, b){
    var aa = a[0].split('/').reverse().join(),
        bb = b[0].split('/').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
})

for(i=0;i<kmlist.length;i++) {
    kmlist[i][0] = [kmlist[i][0].split('/')[0].padStart(2,"0"),kmlist[i][0].split('/')[1].padStart(2,"0"),"20"+kmlist[i][0].split('/')[2]].reverse().join("/");
    if(parseInt(kmlist[i][1])<=0) {
        kmlist[i][1] = "50.00";
    }
    let date1;
    let date2;
    if(i==0){
        date1 = new Date(startDate);
        date2 = new Date(kmlist[i][0]);
    } else {
        date1 = new Date(kmlist[i-1][0]);
        date2 = new Date(kmlist[i][0]);
    }
    let Difference_In_Time = date2.getTime() - date1.getTime();
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    total+=parseInt(kmlist[i][1]);
    if(Math.abs(Difference_In_Days)<100)
    {
        tdp+=Math.abs(Difference_In_Days);
        console.log(kmlist[i])
        //kmlist[i].push(Math.abs(Difference_In_Days))
        //((currentKM-startKM)-total)/kmlist.length
    }    
}
tdp+=kmlist.length;
console.log("Total Services > " + kmlist.length)
console.log("Total Km work > " + total)
console.log("Total Km no-work > " + ((currentKM-startKM)-total))
console.log(((currentKM-startKM)-total)/kmlist.length)
console.log("Total Days > "  + tdp)