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

function search(dir = "/private/clients") {
    //Searchs within Dir from App Root, Return All Files with key in filename, including ones inside folders
    var folders = fs.readdirSync(path.join(process.cwd(), dir));
    var files = [];
    for (let i = folders.length; i--; ) {
        let next = fs.readdirSync(path.join(process.cwd(), dir, folders[i]));
        for (let x = next.length; x--; ) {
            files.push(next[x]);
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
            console.log(files[a]);
            await delay(5000);
            await listDatabases(files[a]);
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
    fs.readFile(
        "./private/clients/" + file.slice(0, -8) + "/" + file,
        "utf8",
        async function (err, data) {
            if (err) {
                return "No such file or directory!";
            }
            data = JSON.parse(await data);
            let clien = await Client.find({ first_name: data.clientName.split(" ")[0] });
            //file.client_id = "woop";
            //console.log(file)
            let serv = [];
            for (let i = 0; i < data.invoice.length; i++) {
                serv.push({
                    service_date: new Date(
                        "20" +
                            data.invoice[i].serviceDate.slice(-2) +
                            data.invoice[i].serviceDate.slice(2, -2) +
                            data.invoice[i].serviceDate.slice(0, 2)
                    ),
                    line_number: data.invoice[i].lineNumber,
                    description: data.invoice[i].description,
                    km: parseFloat(data.invoice[i].km.replace("$", "")),
                    km_rate: parseFloat(data.invoice[i].kmRate.replace("$", "")),
                    hour: parseFloat(data.invoice[i].hours.replace("$", "")),
                    hour_rate: parseFloat(data.invoice[i].hoursRate.replace("$", "")),
                });
            }
            if (data.status == "Uncompleted" || data.status == "uncompleted") {
                data.status = "incomplete";
            }
            //console.log(data.invoiceDate);
            //console.log(data.invoice[0].serviceDate);
            //console.log("20"+data.invoiceDate.slice(-2)+data.invoiceDate.slice(2,-4)+data.invoiceDate.slice(0,2));
            //console.log(new Date(Date.parse("20"+data.invoiceDate.slice(-2)+data.invoiceDate.slice(2,-4)+data.invoiceDate.slice(0,2))))
            const invoice = new Invoice({
                invoice_id: data.clientName.replace(" ", "") + data.invoiceId,
                date: new Date(
                    Date.parse(
                        "20" +
                            data.invoiceDate.slice(-2) +
                            data.invoiceDate.slice(2, -4) +
                            data.invoiceDate.slice(0, 2)
                    )
                ),
                client_fullname: data.clientName,
                client_id: clien[0]._id,
                client_address: data.clientAddress,
                user_fullname: data.name,
                user_bsb: data.bsb,
                user_account: data.account,
                user_bank: data.bank,
                user_abn: data.abn,
                user_phone: data.phone,
                user_email: data.email,
                user_address: data.address,
                status: data.status,
                service: serv,
            });
            // Insert the article in our MongoDB database
            await invoice.save();
            return;
        }
    );
    //databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
