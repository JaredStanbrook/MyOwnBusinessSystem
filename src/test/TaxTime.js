const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const fs = require("fs");
const path = require("path");
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));
var Client = require(path.join(process.cwd(), "db/models/Client"));

const { MongoClient, ObjectId } = require("mongodb");
const connectDB = require("../../config/db");

const start_date = new Date("2023-08-01");
const start_odi_km = 218385;
const end_odi_km = 298780;
const total_odi_km = end_odi_km - start_odi_km;

const fromHomeDistance = [57.3, 10.4, 17.2];

main().catch(console.error);

function calculateDaysDifference(dateArray) {
    if (dateArray.length < 2) {
        console.log("Error: At least two dates are required.");
        return [];
    }

    const daysBetweenDates = [];
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    daysBetweenDates.push(
        Math.round(Math.abs(dateArray[0].service_date - start_date) / millisecondsPerDay)
    );
    for (let i = 1; i < dateArray.length; i++) {
        const difference = Math.abs(dateArray[i].service_date - dateArray[i - 1].service_date);
        const daysDifference = Math.round(difference / millisecondsPerDay);
        daysBetweenDates.push(daysDifference);
    }

    return daysBetweenDates;
}
async function main() {
    try {
        await connectDB();
        let services = await Invoice.find({}, { service: { service_date: 1, km: 1 }, _id: 0 });
        let bigArray = [];
        services.forEach((obj) => {
            bigArray = bigArray.concat(obj.service);
        });
        // Using map and reduce
        bigArray = JSON.parse(
            JSON.stringify(
                services.map((obj) => obj.service).reduce((acc, val) => acc.concat(val), [])
            )
        );
        for (let i = 0; i < bigArray.length; i++) {
            const randomDistance =
                fromHomeDistance[Math.floor(Math.random() * fromHomeDistance.length)];
            bigArray[i].service_date = new Date(Date.parse(bigArray[i].service_date));
            bigArray[i].home_km = randomDistance;
        }
        calculateLogBook(bigArray);
    } catch (e) {
        console.error(e);
    }
}

function calculateLogBook(services) {
    const daysBetweenDatesArray = calculateDaysDifference(services);
    const sum_daysBetween = daysBetweenDatesArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
    const invoice_total_km = services.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.km + currentValue.home_km),
        0
    );
    const rem_km = total_odi_km - invoice_total_km;
    let iter_km = start_odi_km;
    console.log("===========================================================================");
    for (let i = 0; i < services.length; i++) {
        iter_km += daysBetweenDatesArray[i] * (rem_km / sum_daysBetween); //Kilometers between each of the shifts
        let last_iter_km = iter_km;
        iter_km += services[i].km + services[i].home_km; //Kilometers that shift
        console.log(
            services[i].service_date.toLocaleDateString() +
                " | Assistance with transport | " +
                Math.round(last_iter_km) +
                "km | " +
                Math.round(iter_km) +
                "km | " +
                services[i].km +
                "km | " +
                services[i].home_km +
                "km"
        );
        console.log("===========================================================================");
    }
    console.log("On Average I Drove " + Math.round(rem_km / sum_daysBetween) + "km Per Day!");
}
