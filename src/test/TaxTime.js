console.log("node --env-file .env ./src/test/TaxTime.js");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const fs = require("fs");
const path = require("path");
var Invoice = require(path.join(process.cwd(), "db/models/Invoice"));
var Client = require(path.join(process.cwd(), "db/models/Client"));

const { MongoClient, ObjectId } = require("mongodb");
const connectDB = require("../../config/db");

const start_date = new Date("2023-07-01");
const start_odi_km = 218385;
const end_odi_km = 264159;
const total_odi_km = end_odi_km - start_odi_km;

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
        data = JSON.parse(
            JSON.stringify(
                services.map((obj) => obj.service).reduce((acc, val) => acc.concat(val), [])
            )
        );
        const combinedData = combineEntries(data);

        for (let i = 0; i < combinedData.length; i++) {
            combinedData[i].service_date = new Date(Date.parse(combinedData[i].service_date));
        }
        //console.log(combinedData);
        calculateLogBook(combinedData);
    } catch (e) {
        console.error(e);
    }
}
function combineEntries(entries) {
    // Create a map to combine entries with the same date
    const combinedMap = new Map();

    entries.forEach((entry) => {
        const { _id, service_date, km } = entry;

        // If the date is already in the map, add the km to the existing km value
        if (combinedMap.has(service_date)) {
            combinedMap.get(service_date).km += km;
        } else {
            // Otherwise, add a new entry to the map
            combinedMap.set(service_date, { _id, service_date, km });
        }
    });

    // Convert the map back to an array
    const combinedEntries = Array.from(combinedMap.values());

    // Array of home_km values
    const homeKmValues = [57.3, 10.4, 17.2, 17.5, 57.9, 12.4, 10.4, 17.2, 17.5, 57.9, 12.4];

    // Add a random home_km value to each entry
    combinedEntries.forEach((entry) => {
        const randomIndex = Math.floor(Math.random() * homeKmValues.length);
        entry.home_km = homeKmValues[randomIndex];
    });

    return combinedEntries;
}
const displayEntriesWithProgressiveTotal = (entries) => {
    let progressiveBusinessTotal = 0;
    let progressivePrivateTotal = 0;
    let chunkSizes = [11, 10]; // Define the recurring chunk sizes
    let currentIndex = 0;

    entries.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
    // Iterate through combined entries
    // Iterate through combined entries
    while (currentIndex < entries.length) {
        for (let size of chunkSizes) {
            if (currentIndex >= entries.length) break;

            const chunk = entries.slice(currentIndex, currentIndex + size);
            chunk.forEach((entry) => {
                progressiveBusinessTotal += entry.business;
                progressivePrivateTotal += entry.private;
            });

            console.table(chunk, ["start_date", "start", "end", "business", "private"]);
            console.log(
                `Progressive Total KM: ${Math.round(progressiveBusinessTotal)} and ${Math.round(
                    progressivePrivateTotal
                )}`
            );
            currentIndex += size;
        }
    }
};

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
    let total_home_km = 0;
    let total_km = 0;
    book = [];
    for (let i = 0; i < services.length; i++) {
        iter_km += daysBetweenDatesArray[i] * (rem_km / sum_daysBetween); //Kilometers between each of the shifts
        let last_iter_km = iter_km;
        iter_km += services[i].km + services[i].home_km; //Kilometers that shift
        if (services[i].km == 0) {
            continue;
        }
        book.push({
            start_date: services[i].service_date.toLocaleDateString(),
            start: Math.round(last_iter_km) + "km",
            end: Math.round(iter_km) + "km",
            business: services[i].km,
            private: services[i].home_km,
        });
        total_home_km += services[i].km;
        total_km += services[i].home_km;
    }
    // Function to display entries as a grid
    displayEntriesWithProgressiveTotal(book);
}
