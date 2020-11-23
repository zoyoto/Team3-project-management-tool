var express = require('express');
var router = express.Router();

const MongoDB = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://YYW:cs5351@cluster0.ivteu.mongodb.net/SEProject?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const dbName = 'SEProject';
const collectionName = 'test';

let dbObject = null;
let dbCollection = null;

// MongoDB Collection
MongoClient.connect(uri, function(err, dbInstance) {
	if (err) {
		console.log('ERROR: ${err}');
	} else {
		dbObject = dbInstance.db(dbName);
		console.log("[MongoDB connection] SUCCESS");
	}
});

// CRUD
/*router.get("/example", (req, res) => {
	dbCollection = dbObject.collection("example");
	
	// Find All
	dbCollection.find().toArray(err, result) => {
	
	// Find One
	dbCollection.findOne({"phaseStatus": 1}, (err, result) => {
		
		if(err) throw error;
		res.json(result);
	});
});*/
	
	

// Get Cards
router.get("/read/cards", (req, res) => {
	dbCollection = dbObject.collection("cards");
	dbCollection.find().toArray((err, result) => {
	//dbCollection.findOne({"phaseStatus": 1}, (err, result) => {
		if(err) throw error;
		res.json(result);
	});
});


// Create Cards
router.post("/create/card", (req, res) => {
	let title = req.body.title;
	let description = req.body.description;
	let people = req.body.people;
    let budget = req.body.budget;
    let duration = req.body.duration;
    let predecessor = req.body.predecessor;

	dbCollection = dbObject.collection("cards");
	dbCollection.insert({phaseStatus: 1, title: title, description: description, people:people, budget:budget, duration:duration, predecessor:predecessor}, (err, result) => {
	//dbCollection.findOne({"phaseStatus": 1}, (err, result) => {
		if(err) throw error;
		res.json(result["ops"][0]);
	});
});

// Delete Card
router.post("/delete/card", (req, res) => {
	let uid = req.body.uid;

	dbCollection = dbObject.collection("cards");
	dbCollection.deleteOne({_id: new MongoDB.ObjectId(uid)}, (err, result) => {
		if(err) throw error;
		res.json({_id: uid});
	});
});

// Update Card
router.post("/update/card", (req, res) => {
	let uid = req.body.uid;
	let title = req.body.title;
	let description = req.body.description;
	let people = req.body.people;
    let budget = req.body.budget;
    let duration = req.body.duration;
    let predecessor = req.body.predecessor;

	dbCollection = dbObject.collection("cards");
	dbCollection.updateOne(
		{_id: new MongoDB.ObjectId(uid)},
		{$set:{title: title, description:description, people:people, budget:budget, duration:duration, predecessor:predecessor}},
	(err, result) => {
		if(err) throw error;
		res.json({_id: uid});
	});
});

// Update Card Phase
router.post("/update/card_phase", (req, res) => {
	let uid = req.body.uid;
	let phaseStatus = req.body.phaseStatus;

	dbCollection = dbObject.collection("cards");
	dbCollection.updateOne(
		{_id: new MongoDB.ObjectId(uid)},
		{$set:{phaseStatus: phaseStatus}},
	(err, result) => {
			if(err) throw error;
		res.json({_id: uid, phaseStatus: phaseStatus});
	});
});

module.exports = router;
