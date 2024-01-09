const { clear } = require('console');
const fs = require('fs');

var startKM = 213385; //213,385km
var currentKM = 241345; //241,345km
var serviceformat = ["Date","Description","Km","KmRate",]
var total = 0;

var files = fs.readdirSync(__dirname);
for(var i = files.length; i--;) {
    if(!files[i].includes("invoice")) {
        files.splice(i, 1);
    }
}
var done = files.length;
for(done; done--;) {
    fs.readFile(files[done], 'utf8', function(err, data){ 
        var t = 0;
        if(err) {
            return "Error";
        }
        var obj = JSON.parse(data);
        if(obj[2][1] == "Seth Smith") {
            for(x=0;x<obj.length;x++) {
                if(obj[x][0].substring(1) == "service0") {
                    console.log(obj[x][1]);
                }
                if(obj[x][0].substring(1) == "service2") {
                    console.log(obj[x][1]);
                    let n = parseFloat(obj[x][1]);
                    total += n;
                    console.log(total)
                }
            }
        }   
    });
    console.log(done);
}

if(done<=0) {
    console.log(total);
}