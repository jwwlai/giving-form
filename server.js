const express = require("express");
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

// DATABASE MODELS
const Donation = require("./models/donation");
const DonationLedger = require("./models/donation-ledger");


// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function updateLedger(firstName, lastName, donationAmount) {
	// See if the ledger exists, if not create a new one
	DonationLedger.findOne({ _donationType: "ledger" }, function(err, donationLedger) {
		if (err) {
			return;
		}

		if (!donationLedger) {
			donationLedger = new DonationLedger();
		}

		// Ledger already exists, so just update it.
		// Add to total donation amount
		if (donationAmount.includes("$")) {
			donationAmount = parseInt(donationAmount.split("$")[1]);
		} else {
			donationAmount = parseInt(donationAmount);
		}
		donationLedger.totalDonations = donationLedger.totalDonations + donationAmount;

		// Update ledger
		const ledger = { firstName, lastName, donationAmount };
		donationLedger.summaryInfo.push(ledger);
		donationLedger.markModified("summaryInfo");

		// Save - Needs error handling
		donationLedger.save();
	})
}

// API ENDPOINTS
app.get("/api/donations", (req, res) => {
	DonationLedger.findOne({ _donationType: "ledger" }, function(err, donationLedger) {
		if (err) {
			res.send(err);
			return;
		}

		res.status(200).send(donationLedger);
	});
});


app.post("/api/donation", (req, res) => {
	const donation = new Donation();

	// Save to ledger to keep a record of all donations
	updateLedger(req.body.donation.firstName, req.body.donation.lastName, req.body.donation.donationAmount);

	// Save to donation database
	lodash.merge(donation, req.body.donation);
	donation.save(function(err) {
		if (err) {
			res.send(err);
			return;
		}
		res.status(200).json();
	});
});



app.listen(port, () => console.log(`Listening on port ${port}`));