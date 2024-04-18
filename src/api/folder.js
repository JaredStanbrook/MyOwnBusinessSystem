const fs = require("fs");
const path = require("path");
var Client = require(path.join(process.cwd(), "db/models/Client"));
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));
const { Types } = require("mongoose");

module.exports = {
    deepCopy: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    isObjectEmpty: function (obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    isUndefined: function (value) {
        return typeof value === "undefined";
    },
    filter: async function (field = [], operator = [], value = []) {
        field = field.split(","); //TODO
        operator = operator.split(",");
        value = value.split(",")[0];
        if (value == "" || value == "*") {
            return await Invoice.find({});
        }
        return await Invoice.find({ client_fullname: value });
    },
    retrieveInvoice: async function (id, client = "") {
        let data = {};
        data.file = this.deepCopy(await Invoice.find({ _id: new Types.ObjectId(id) }).limit(1))[0];
        if (!data.file) {
            data.file = this.deepCopy(
                await Invoice.find({}).sort({ _id: -1, date: -1 }).limit(1)
            )[0];
        }

        var next = this.deepCopy(
            await Invoice.find({
                _id: { $gt: data.file._id },
                //date: { $gte: data.file.date },
            })
                .sort({ _id: 1 })
                .limit(1)
        )[0];
        if (this.isUndefined(next)) {
            next = {
                invoice_id: "",
            };
        }
        let last = this.deepCopy(
            await Invoice.find({
                _id: { $lt: data.file._id },
                //date: { $lte: data.file.date },
            })
                .sort({ _id: -1 })
                .limit(1)
        )[0];

        if (this.isUndefined(last)) {
            last = {
                invoice_id: "",
            };
        }
        data.path = [last._id, data.file._id, next._id];
        return data;
    },
    retrievePath: async function (data) {
        let next = this.deepCopy(
            await Invoice.find({
                _id: { $gt: data._id },
                //date: { $gte: data.date },
            })
                .sort({ _id: 1 })
                .limit(1)
        )[0];

        if (this.isUndefined(next)) {
            next = {
                invoice_id: "",
            };
        }
        let last = this.deepCopy(
            await Invoice.find({
                _id: { $lt: data._id },
                //date: { $lte: data.date },
            })
                .sort({ _id: -1 })
                .limit(1)
        )[0];

        if (this.isUndefined(last)) {
            last = {
                invoice_id: "",
            };
        }
        let path = [last._id, data._id, next._id];
        return path;
    },
};
