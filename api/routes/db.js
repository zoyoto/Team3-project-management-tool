var express = require('express');
var router = express.Router();

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


// Add Cards
router.post("/create/card", (req, res) => {
	let title = req.body.title;
	let description = req.body.description;

	dbCollection = dbObject.collection("cards");
	dbCollection.insert({phaseStatus: 1, title: title, description: description}, (err, result) => {
	//dbCollection.findOne({"phaseStatus": 1}, (err, result) => {
		if(err) throw error;
		res.json(result["ops"][0]);
	});
});

module.exports = router;
