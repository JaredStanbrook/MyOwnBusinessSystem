var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const folder = require("../folder.js");
var Client = require(path.join(process.cwd(), "db/models/Client"));
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));
const mongoose = require("mongoose");

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/* GET guide. */
router.get("/", function (req, res, next) {
    (async function () {
        let file = folder.deepCopy(await Client.find({}).sort({ _id: 1 }));
        if (folder.isUndefined(file)) {
            return res.json({
                status: 404,
                message: "No Such Client!",
            });
        }
        return res.status(200).json(file); //.json(await folder.retrieveInvoice(file, client._id));
    })();
});
router.get("/:clientId/invoices", function (req, res) {
    //return all invoices for client
    let id = req.params.clientId;
    (async function () {
        let file = folder.deepCopy(await Invoice.find({ client_fullname: id }).sort({ _id: 1 }));
        if (folder.isUndefined(file)) {
            return res.json({
                status: 404,
                message: "No Such Client!",
            });
        }
        return res.status(200).json(file); //.json(await folder.retrieveInvoice(file, client._id));
    })();
});
router.get("/:clientId/latest", function (req, res) {
    //return latest invoices for client
    let id = req.params.clientId;
    (async function () {
        let file = folder.deepCopy(
            await Invoice.find({ client_fullname: id }).sort({ _id: -1 }).limit(1)
        )[0];
        if (folder.isUndefined(file)) {
            return res.json({
                status: 404,
                message: "No Such Client!",
            });
        }
        let path = await folder.retrievePath(file);
        return res.status(200).send({ file: file, path: path });
    })();
});
module.exports = router;
