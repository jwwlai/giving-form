const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
	donationAmount: String,
	firstName: String,
	lastName: String,
	email: String,
	phoneNumber:String,
	streetAddress: String,
	city: String,
	state: String,
	zip: String,
	creditCardNumber: String,
	cvv: String,
	expireMonth: String,
	expireYear: String
});

module.exports = mongoose.model("donations", DonationSchema);