const express = require("express");

const { connectToDb, getDb } = require("./db");

// initialize the app
const app = express();

// setup middleware
// parse incoming json
app.use(express.json());

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3001, () => {
            console.log("Listening on port 3001");
        });

        db = getDb();
    }
})


// Creating our RESTful API endpoints

// Defining the API routes here

app.get("/api/students", (req, res) => {
    // We have 120 records in our database, now we can't really send all of them at once
    // So we will use pagination (limit and skip)
    const page = req.query.p || 0;
    const studentsPerPage = 10;
    let students = [];
    db.collection("students")
        .find()
        .sort({ id: 1 }) // 1 for ascending and -1 for descending
        .skip(page * studentsPerPage)
        .limit(studentsPerPage)
        .forEach(student => students.push(student))
        .then(() => {
            res.status(200).json(students);
        })
        .catch(() => {
            res.status(500).json({ msg: "Error getting students" });
        })
})

// Get a single student
app.get("/api/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    if (!isNaN(studentId)) {
        db.collection("students")
            .findOne({ id: studentId })
            .then((student) => {
                if (student) {
                    res.status(200).json(student);
                } else {
                    res.status(404).json({ msg: "Student not found" });
                }
            })
            .catch(() => {
                res.status(500).json({ msg: "Error getting student" });
            })
    } else {
        res.status(400).json({ error: "Invalid ID" });
    }
})

// Creating a new student
app.post("/api/students", (req, res) => {
    const newStudent = req.body;
    db.collection("students")
        .insertOne(newStudent)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ msg: "Error creating student" });
        })
})

// Updating a student
app.patch("/api/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    let updatedStudent = req.body;
    if (!isNaN(studentId)) {
        db.collection("students")
            .updateOne(
                { id: studentId },
                { $set: updatedStudent }
            )
            .then(result => {
                res.status(200).json(result);
            })
            .catch(() => {
                res.status(500).json({ msg: "Error updating student" });
            })
    } else {
        res.status(400).json({ error: "Invalid ID" });
    }
})

// Deleting a student
app.delete("/api/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    if (!isNaN(studentId)) {
        db.collection("students")
            .deleteOne({ id: studentId })
            .then(result => {
                res.status(200).json(result);
                /*
                status code 204: no response body (returns null)
                status code 200: returns response body
                    {
                        "acknowledged": true,
                        "deletedCount": 1
                    }
                */
            })
            .catch(() => {
                res.status(500).json({ msg: "Error deleting student" });
            })
    } else {
        res.status(400).json({ error: "Invalid ID" });
    }
})