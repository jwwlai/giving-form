const express = require('express');
const bodyParser = require("body-parser");
const lodash = require("lodash");

const app = express();
const port = process.env.PORT || 5000;

// DATABASE SETUP
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/funraise");
mongoose.connection.on("error", function(err) {
	console.log(err);
});
mongoose.connection.on("connected", function() {
	console.log("Connected");
});

const Donation = require("./models/donation");

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// API ENDPOINTS
app.post('/api/donation', (req, res) => {
	const donation = new Donation();
	lodash.merge(donation, req.body.donation);

	donation.save(function(err) {
		if (err) {
			res.send(err);
			return;
		}
		res.json({ message: "Donation was added successfully" });
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));