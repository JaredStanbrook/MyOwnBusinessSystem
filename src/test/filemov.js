const fs = require("fs");
const path = require("path");

var folders = fs.readdirSync("./private/clients");
var files = [];
for (let i = folders.length; i--; ) {
    let upper = fs.readdirSync("./private/clients/" + folders[i]);
    for (let x = upper.length; x--; ) {
        upper[x] = folders[i] + "/" + upper[x];
        files.push(upper[x]);
    }
}
console.log(files);
function isInt(value) {
    return (
        !isNaN(value) &&
        (function (x) {
            return (x | 0) === x;
        })(parseFloat(value))
    );
}
function extractNum(value) {
    //returns String
    try {
        var num = value.match(/\d/g);
    } catch (error) {
        return null;
    }
    return num.join("");
}
async function read(file) {
    fs.readFile("./private/clients/" + file, "utf8", function (err, data) {
        if (err) {
            return "No such file or directory!";
        }
        let Path = "./private/clients/" + file;
        console.log(Path);
        return;
        var obj = JSON.parse(data);
        obj.invoiceId = parseInt(extractNum(file));
        let oldPath = "./private/clients/" + file;
        let newPath =
            "./private/clients/" +
            obj.clientName.replace(/\s/g, "") +
            "/" +
            obj.clientName.replace(/\s/g, "") +
            (parseInt(extractNum(file)) + 1000) +
            file.slice(-4);
        console.log(oldPath + "      =      " + newPath);
        /*
            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err;
                console.log("Successfully renamed - AKA moved!");
            });
            /*
            //obj["invoiceId"] = obj.invoiceNumber;
            //delete obj.invoiceNumber;
            /*
        obj.invoiceNumber = obj.invoiceNumber.slice(16);
        obj.invoiceDate = obj.invoiceDate.slice(6);
        for (i = 0; i < obj.invoice.length; i++) {
            let string = obj.invoice[i].description;
            for (x = 0; x < string.length; x++) {
                if (!isInt(string[x]) && string[x] != "_") {
                    obj.invoice[i]["lineNumber"] = string.slice(0, x);
                    if (x <= 0) {
                        obj.invoice[i].description = string.slice(x);
                    } else {
                        obj.invoice[i].description = string.slice(x + 1);
                    }
                    break;
                }
            }
        }
        */
        console.log(obj);
        /*
    var data = {};

    for (i = 0; i < 14; i++) {
      //obj.length
      //console.log(obj[i][0]);
      let text = obj[i][0];
      let pos = obj[i][0].search("-");
      if (pos > 0) {
        text =
          obj[i][0].substring(0, pos) +
          obj[i][0].substring(pos + 1, pos + 2).toUpperCase() +
          obj[i][0].substring(pos + 2);
      }
      data[text] = obj[i][1];
        }
        let template = [
        "serviceDate",
        "description",
        "km",
        "kmRate",
        "hours",
        "hoursRate",
        "total",
        ];
        data["invoice"] = [];
        let t = 0;
        let temp = {};
        for (x = 14; x < obj.length; x++) {
        temp[template[t]] = obj[x][1]; //temp[obj[x][0]] = obj[x][1];
        if (t >= 6) {
            data.invoice.push(temp);
            t = 0;
            temp = {};
        } else {
            t++;
        }
        }*/

        fs.writeFile("./private/clients/" + file, JSON.stringify(obj), "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        return true;
    });
}

function checkInvoice(row, feild) {
    return data.invoice[row][feild];
}
//read("invoice0001.txt");

for (a = 0; a < files.length; a++) {
    read(files[a]);
}

async function filter(files, field, operation, value) {
    const list = [];
    for (const file of files) {
        const contents = await fs.readFileSync(file, "utf8", (err) => err && console.error(err));
        var obj = JSON.parse(contents);
        let pass = false;
        for (i = 0; i < field.length; i++) {
            if (value[i] == "*") {
                pass = true;
            } else {
                switch (operation[i]) {
                    case "==":
                        if (obj[field[i]] == value[i]) {
                            pass = true;
                        } else {
                            pass = false;
                        }
                        break;
                    default:
                }
            }
        }
        if (pass) {
            list.push(file);
        }
    }
    return list;
}
/*
(async function () {
    let store = await filter(files, ["clientName", "invoiceNumber"], ["==", "=="], ["*", "0004"]);
    console.log(store);
})();
*/
