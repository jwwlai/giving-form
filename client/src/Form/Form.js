import React from "react";
import "./Form.css";
import FormPane from "./FormPane";
import SummaryPane from "./SummaryPane";
import validator from "validator";

const LABELS = {
	donationAmount: "Donation amount",
	firstName: "First name",
	lastName: "Last name",
	email: "E-mail",
	phoneNumber: "Phone number",
	streetAddress: "Street address",
	city: "City",
	state: "State",
	zip: "Zipcode",
	creditCardNumber: "Credit card number",
	cvv: "CVV",
	expireMonth: "Expiration month",
	expireYear: "Expiration year"
};

export default class Form extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the form order
		this.state = {
			currentFormIdx: 0,
			hasNextForm: false,
			hasPreviousForm: false,
			formGroups: {},
			formData: {
				donationAmount: "",
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				streetAddress: "",
				city: "",
				state: "",
				zip: "",
				creditCardNumber: "",
				cvv: "",
				expireMonth: "",
				expireYear: ""
			}
		};

		// Bind event handlers
		this._getNextFormCard = this._getNextFormCard.bind(this);
		this._getPreviousFormCard = this._getPreviousFormCard.bind(this);
		this._handleOnChange = this._handleOnChange.bind(this);
		this._handleOnSubmit = this._handleOnSubmit.bind(this);
		this._clearForm = this._clearForm.bind(this);
	}

	componentWillMount() {
		this._initializeForm();
	}

	_initializeForm() {
		this.setState({
			formGroups: {
				0: () => this._getDonationAmountCard(),
				1: () => this._getDonorInfoCard(),
				2: () => this._getBillingAddressCard(),
				3: () => this._getPaymentInfoCard()
			}
		}, () => {
			this.totalFormGroups = Object.keys(this.state.formGroups).length;
			this.setState({
				hasNextForm: this.totalFormGroups > 1
			});
		});
	}

	_clearForm() {
		this.setState({
			currentFormIdx: 0,
			hasNextForm: true,
			hasPreviousForm: false,
			formData: {
				donationAmount: "",
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				streetAddress: "",
				city: "",
				state: "",
				zip: ""
			}
		});
	}

	_handleOnChange(e) {
		let formData = Object.assign({}, this.state.formData);
		formData[e.target.name] = e.target.value;
		this.setState({ formData });
	}

	_handleOnSubmit(e) {
		console.log("Creating new donation");
		fetch("/api/donation", {
			method: "POST",
			body: JSON.stringify({ donation: this.state.formData }),
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
		.then((response) => {
			alert("Thank you for your donation!");

			// TODO display a thanks donation page
		})
	}

	_getNextFormCard() {
		this.setState((prevState) => {
			let nextFormIdx = prevState.currentFormIdx + 1;
			return {
				currentFormIdx: nextFormIdx,
				hasNextForm: (nextFormIdx < this.totalFormGroups),
				hasPreviousForm: true
			}
		});
	}

	_getPreviousFormCard() {
		this.setState((prevState) => {
			let nextFormIdx = prevState.currentFormIdx - 1;
			return {
				currentFormIdx: nextFormIdx,
				hasNextForm: (this.totalFormGroups > 1),
				hasPreviousForm: (nextFormIdx > 0)
			}
		});
	}

	_getLastCard() {
		return <SummaryPane formData={this.state.formData} formLabels={LABELS} />;
	}

	// FORM SECTIONS

	_getDonationAmountCard() {
		return (
			<FormPane
				formHeader="Donation amount"
				formInputs={{
					donationAmount: {
						placeholder: "Or enter in an amount",
						value: this.state.formData.donationAmount,
						required: true,
						isValid: (field) => { return validator.isCurrency(field) }
					}
				}}
				onChange={this._handleOnChange}
			>
				<div className="button-wrapper">
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$50" />
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$100" />
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$150" />
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$300" />
				</div>
			</FormPane>
		);
	}

	_getDonorInfoCard() {
		return (
			<FormPane
				formHeader={"Donation information"}
				formInputs={{
					firstName: {
						placeholder: LABELS.firstName,
						value: this.state.formData.firstName,
						required: true,
						isValid: (field) => { return field !== "" }
					},
					lastName: {
						placeholder: LABELS.lastName,
						value: this.state.formData.lastName,
						required: true,
						validators: ["required"]
					},
					email: {
						placeholder: LABELS.email,
						value: this.state.formData.email,
						required: true,
						validators: ["required", "email"]
					},
					phoneNumber: {
						placeholder: LABELS.phoneNumber,
						value: this.state.formData.phoneNumber,
						validators: [""]
					}
				}}
				onChange={this._handleOnChange}
			/>
		);
	}

	_getBillingAddressCard() {
		return (
			<FormPane
				formHeader={"Billing Address"}
				formInputs={{
					streetAddress: {
						placeholder: LABELS.streetAddress,
						value: this.state.formData.streetAddress,
						required: true,
						validators: [""]
					},
					city: {
						placeholder: LABELS.city,
						value: this.state.formData.city,
						required: true,
						validators: [""]
					},
					state: {
						placeholder: LABELS.state,
						value: this.state.formData.state,
						required: true,
						validators: [""]
					},
					zip: {
						placeholder: LABELS.zip,
						value: this.state.formData.zip,
						required: true,
						validators: [""]
					}
				}}
				onChange={this._handleOnChange}
			/>
		);
	}

	_getPaymentInfoCard() {
		return (
			<FormPane
				formHeader={"Payment information"}
				formInputs={{
					creditCardNumber: {
						placeholder: LABELS.creditCardNumber,
						value: this.state.formData.creditCardNumber,
						required: true,
						validators: [""]
					},
					cvv: {
						placeholder: LABELS.cvv,
						value: this.state.formData.cvv,
						required: true,
						validators: [""]
					},
					expireMonth: {
						placeholder: LABELS.expireMonth,
						value: this.state.formData.expireMonth,
						required: true,
						validators: [""]
					},
					expireYear: {
						placeholder: LABELS.expireYear,
						value: this.state.formData.expireYear,
						required: true,
						validators: [""]
					}
				}}
				onChange={this._handleOnChange}
			/>
		);
	}

	render() {
		return (
			<div>
				<form onSubmit={this._handleOnSubmit}>
					{ this.state.hasNextForm
						? (this.state.formGroups[this.state.currentFormIdx])()
						: this._getLastCard()
					}

					<button type="button" onClick={this._getPreviousFormCard} disabled={!this.state.hasPreviousForm}>
						Go back
					</button>

					{ this.state.hasNextForm
						? <button type="button" onClick={this._getNextFormCard}>Next</button>
						: <input type="submit" value="Submit" />
					}

					<button type="button" onClick={this._clearForm}>
						Clear form
					</button>
				</form>
			</div>
		);
	}
};