const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const fs = require("fs");
const path = require("path");
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));
var Client = require(path.join(process.cwd(), "db/models/Client"));

const { MongoClient, ObjectId } = require("mongodb");
/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const connectDB = require("../../config/db");
var dir = "/Users/jaredstanbrook/Documents/InvoiceApp Working Version/";

function search() {
    //Searchs within Dir from App Root, Return All Files with key in filename, including ones inside folders
    let files = fs.readdirSync(dir);
    for (var i = files.length; i--; ) {
        if (!files[i].includes("invoice")) {
            files.splice(i, 1);
        }
    }
    return files.sort(function (a, b) {
        return a.slice(-8, -4) - b.slice(-8, -4);
    });
    //Sorts Number of clientName "1001" .txt ONLY
}

async function main() {
    try {
        await connectDB();
        let files = await search();

        for (a = 0; a < files.length; a++) {
            //files.length
            await listDatabases(files[a]);
            await delay(5000);
        }
    } catch (e) {
        console.error(e);
    }
}
main().catch(console.error);
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function listDatabases(file) {
    //databasesList = await client.db().admin().listDatabases();
    fs.readFile(dir + file, "utf8", async function (err, data) {
        if (err) {
            return "No such file or directory!";
        }
        data = JSON.parse(await data);
        //console.log(data);
        let clien = await Client.find({ first_name: data[2][1].split(" ")[0] });
        //file.client_id = "woop";
        //console.log(file)
        let service = data.slice(14);
        let serv = [];
        for (let i = 0; i < service.length / 7; i++) {
            serv.push({
                service_date: new Date(
                    "20" +
                        service[i * 7 + 0][1].slice(-2) +
                        service[i * 7 + 0][1].slice(2, -2) +
                        service[i * 7 + 0][1].slice(0, 2)
                ),
                line_number: "01_011_077_0_0",
                description: service[i * 7 + 1][1],
                km: parseFloat(service[i * 7 + 2][1].replace("$", "")),
                km_rate: parseFloat(service[i * 7 + 3][1].replace("$", "")),
                hour: parseFloat(service[i * 7 + 4][1].replace("$", "")),
                hour_rate: parseFloat(service[i * 7 + 5][1].replace("$", "")),
            });
        }
        //console.log(data.invoiceDate);
        //console.log(data.invoice[0].serviceDate);
        //console.log("20"+data.invoiceDate.slice(-2)+data.invoiceDate.slice(2,-4)+data.invoiceDate.slice(0,2));
        //console.log(new Date(Date.parse("20"+data.invoiceDate.slice(-2)+data.invoiceDate.slice(2,-4)+data.invoiceDate.slice(0,2))))
        const invoice = new Invoice({
            invoice_id: data[2][1].split(" ")[0] + data[2][1].split(" ")[1] + "1" + file.slice(8, -4),
            date: new Date(
                Date.parse(
                    "20" + data[1][1].slice(-2) + data[1][1].slice(8, -4) + data[1][1].slice(6, 8)
                )
            ),
            client_fullname: data[2][1],
            client_id: clien[0]._id,
            client_number: data[4][1].slice(1),
            client_address: data[5][1],
            user_fullname: data[6][1],
            user_bsb: data[7][1],
            user_account: data[8][1],
            user_bank: data[9][1],
            user_abn: data[10][1],
            user_phone: data[11][1],
            user_email: data[12][1],
            user_address: data[13][1],
            status: "completed",
            service: serv,
        });
        // Insert the article in our MongoDB database
        console.log(invoice);
        await invoice.save();
        return;
    });
    //databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
