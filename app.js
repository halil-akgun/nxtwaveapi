const express = require("express");

const { connectToDb, getDb } = require("./db");

const app = express();

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3001, () => {
            console.log("Listening on port 3001");
        });

        db = getDb();
    }
})
