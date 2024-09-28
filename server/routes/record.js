import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This will help us convert the id from a string to an ObjectID 
import { ObjectId } from "mongodb"

// router is an instance of the express router
// we use it to define our routes
// the router will be added as a middleware and will take control of requests starting with /record
const router = express.Router();

// get a list of all records
router.get("/", async (req, res) => {
    let collection = await db.collection(records);
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// create a new record
router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };
        let collection = await db.collection("records");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

// update a record
router.patch(":/id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)};

        const updates = {
            $set : {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);

        res.send(result).status(200);    
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});

// delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status.status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

export default router;
