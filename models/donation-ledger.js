const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationLedger = new Schema({
	_donationType: { type: String, default: "ledger" },
	summaryInfo: { type: Array, default: [] },
	totalDonations: { type: Number, default: 0 }
});

module.exports = mongoose.model("ledgers", DonationLedger, "donations");