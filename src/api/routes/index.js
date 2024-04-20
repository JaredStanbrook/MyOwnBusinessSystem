var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const folder = require("../folder.js");
var Client = require(path.join(process.cwd(), "db/models/Client"));
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/", function (req, res, next) {
    (async function () {
        //let client = folder.deepCopy(await Client.find({ first_name: "Seth", family_name: "Smith" }))[0];
        let latest = folder.deepCopy(await Invoice.find({}).sort({ _id: -1 }).limit(1))[0]
        let file = await folder.retrieveInvoice(await latest._id);
        res.render("index", {
            title: "Invoice App",
            invoice: file.path,
        });
    })();
});

module.exports = router;
