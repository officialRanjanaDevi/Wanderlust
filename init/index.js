const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
    return initDB();
}).catch((err) => {
    console.log("Cannot connect:", err);
}).finally(() => {
    mongoose.disconnect();
});

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data=initData.data.map((obj)=>({
            ...obj,owner:"66c48557ec9e760a0e05d504",
        }));
        await Listing.insertMany(initData.data);
        console.log("Database initialized with data");
    } catch (err) {
        console.log("Error initializing database:", err);
    }
}
initDB();