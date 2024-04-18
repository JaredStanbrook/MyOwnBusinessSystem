const { clear } = require('console');
const fs = require('fs');

var total = 0;
var done = 0;
var files = fs.readdirSync(__dirname);
for(var i = files.length; i--;) {
    if(!files[i].includes("invoice")) {
        files.splice(i, 1);
    }
}

function read(cb) {
    for(i=1;i<=25;i++) {
        fs.readFile('invoice'+i.toString().padStart(4,"0")+'.txt', 'utf8', function(err, data){ 
            var t = 0;
            if(err) {
                return "Error";
            }
            var obj = JSON.parse(data);
            if(obj[2][1] == "Seth Smith") {
                for(x=0;x<obj.length;x++) {
                    if(obj[x][0].substring(1) == "service6") {
                        //console.log(parseFloat(obj[x][1].substring(1)));
                        let n = parseFloat(obj[x][1].substring(1));
                        t += n;
                    }
                }
                cb(t);
            }   
        });
    }
}
read(function(data) {
    total += data; 
    done+=1;
    if(done>=14) {
        console.log(total);
    }
});