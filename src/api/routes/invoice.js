var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const folder = require("../folder.js");
var Client = require(path.join(process.cwd(), "db/models/Client"));
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/config", function (req, res) {
    (async function () {
        let fileContent = fs.readFileSync("./dist/config/config.json");
        let config = JSON.parse(fileContent);
        return res.status(200).json(config);
    })();
});
router.get("/latest", function (req, res) {
    (async function () {
        return res
            .status(200)
            .json(folder.deepCopy(await Invoice.find({}).sort({ date: -1 }).limit(1)));
    })();
});
router.post("/", function (req, res) {
    if (folder.isObjectEmpty(req.body)) {
        return res.json({
            status: false,
            message: "Body is required.",
        });
    }
    const parcel = req.body;
    if (!req.query.path) {
        req.query.path = false;
    }

    const { path } = req.query;
    (async function () {
        try {
            let result = await Invoice.create(parcel);
            let obj = { status: "Saved!" };
            if (path) {
                obj.path = await folder.retrievePath({ _id: result._id });
            }
            return res.status(200).send(obj);
        } catch (e) {
            res.status(401).send({ status: "No Fucking Good Mate" });
            return console.error(e);
        }
    })();
});
router.get("/", function (req, res) {
    if (!req.query.field) {
        req.query.field = "clientName";
    }
    if (!req.query.operator) {
        req.query.operator = "==";
    }
    if (!req.query.value) {
        req.query.value = "";
    }

    const { field, operator, value } = req.query;

    (async function () {
        res.send(await folder.filter(field, operator, value));
    })();
});
router.put("/", function (req, res) {
    if (folder.isObjectEmpty(req.body)) {
        return res.json({
            status: false,
            message: "Body is required.",
        });
    }
    const parcel = req.body;

    return res.status(200).send({ status: "Re-Write All Invoices" });
});

router.delete("/", function (req, res) {
    res.status(200).send({ status: req.params.fileName + " was deleted!" });
});

router.post("/:fileName", function (req, res) {
    if (folder.isObjectEmpty(req.body)) {
        return res.json({
            status: false,
            message: "Body is required.",
        });
    }
    const parcel = req.body;

    (async function () {
        try {
            await Invoice.create(parcel);
            return res.status(200).send({ status: "Saved! " + req.params.fileName });
        } catch (e) {
            res.status(401).send({ status: "No Fucking Good Mate" });
            return console.error(e);
        }
    })();
});

router.get("/:fileName", function (req, res) {
    if (!req.query.field) {
        req.query.field = "clientName";
    }
    if (!req.query.operator) {
        req.query.operator = "==";
    }
    if (!req.query.value) {
        req.query.value = "";
    }

    const { field } = req.query;
    const { operator } = req.query;
    const { value } = req.query;

    let file = req.params.fileName;

    //console.log(req.get("accept"));
    (async function () {
        if (!value == "" || !value == "*") {
            let name = value.split(" ");
            console.log(name);
            let client = folder.deepCopy(
                await Client.find({ first_name: name[0], family_name: name[1] })
            )[0];
            if (folder.isUndefined(client)) {
                return res.json({
                    status: 404,
                    message: "No Such Client!",
                });
            }
        } else {
            client = { _id: "*" };
        }
        return res.status(200).json(await folder.retrieveInvoice(file, client._id));
    })();
});

router.put("/:fileName", function (req, res) {
    if (folder.isObjectEmpty(req.body)) {
        return res.json({
            status: false,
            message: "Body is required.",
        });
    }
    const parcel = req.body;
    (async function () {
        try {
            await Invoice.findOneAndReplace(
                { _id: parcel._id },
                parcel,
                {
                    upsert: false,
                },
                { maxTimeMS: 10 }
            );
            return res.status(200).send({ status: "Saved! " + req.params.fileName });
        } catch (e) {
            res.status(401).send({ status: "No Fucking Good Mate" });
            return console.error(e._message);
        }
    })();
});
router.delete("/:fileName", function (req, res) {
    if (folder.isObjectEmpty(req.params.fileName)) {
        return res.json({
            status: false,
            message: "id is required.",
        });
    }
    let id = req.params.fileName;
    (async function () {
        try {
            await Invoice.deleteOne({ _id: id });
            return res.status(200).send({ status: id + " was deleted!" });
        } catch (e) {
            res.status(401).send({ status: "No Fucking Good Mate" });
            return console.error(e._message);
        }
    })();
});
router.get("/services", function (req, res) {
    if (!req.query.field) {
        req.query.field = "clientName";
    }
    if (!req.query.operator) {
        req.query.operator = "==";
    }
    if (!req.query.value) {
        req.query.value = "";
    }

    const { field } = req.query;
    const { operator } = req.query;
    const { value } = req.query;

    (async function () {
        all_services = await Invoice.find({}, { service: 1, _id: 0 });
        res.send({ status: "Hello, This is Alex's Website" });
    })();
});
module.exports = router;
