var express = require("express");
var router = express.Router();
const fs = require('fs');
const path = require('path'); 

var files = fs.readdirSync(path.join(__dirname, "../"));
for(var i = files.length; i--;) {
    if(!files[i].includes("invoice")) {
        files.splice(i, 1);
    }
}

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Invoice App", invoice: "Invoice: " + files[files.length-1].slice(7,-4)});
});

router.get("/file:dynamic", function (req, res) {
  const { dynamic } = req.params;
  const { key } = req.query;
  const { action } = req.query;
  switch(dynamic) {
    case "invoice":
      var file = files[files.indexOf('invoice'+key+'.txt')+parseInt(action)]
      fs.readFile(file, 'utf8', function(err, data){ 
        if(err) {
          return res.status(400).send({ status: "No such file or directory!" });
        }
          var obj = JSON.parse(data);
        return res.status(200).json(obj); 
      });
      break;
    case "filter": 
      console.log("filter");
      break;
    default:
  }
});

router.post("/", function (req, res) {
  const parcel = req.body;
  const { key } = req.query;
  console.log(key);
  console.log(parcel[0][1].slice(-4))
  if (!parcel) {
    return res.status(400).send({ status: "failed" });
  }
  switch(key) {
    case "save":
      fs.writeFile("invoice" + parcel[0][1].slice(-4) + ".txt", JSON.stringify(parcel), 'utf8', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
      });
      break;
    case "print":
      console.log(parcel)
      break;
    default:
    res.status(200).send({ status: "recieved" });
  }
});

module.exports = router;
