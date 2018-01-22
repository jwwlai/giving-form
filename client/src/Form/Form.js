import React from "react";
import PropTypes from "prop-types";
import "./Form.css";
import FormPane from "./FormPane";
import SummaryPane from "./SummaryPane";
import validator from "validator";
import {Step, StepLabel, Stepper,} from 'material-ui/Stepper';

const LABELS = {
	donationAmount: "donation amount",
	firstName: "first name",
	lastName: "last name",
	email: "e-mail",
	phoneNumber: "phone number",
	streetAddress: "street address",
	city: "city",
	state: "state",
	zip: "zipcode",
	creditCardNumber: "credit card number",
	cvv: "CVV",
	expireMonth: "expiration month",
	expireYear: "expiration year"
};

export default class Form extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the form order
		this.state = {
			currentFormIdx: 0,
			hasNextForm: false,
			hasPreviousForm: false,
			hasError: true,
			hasBeenSubmitted: false,
			showTable: false,
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
		this._handleOnError = this._handleOnError.bind(this);
		this._clearForm = this._clearForm.bind(this);
		this._toggleDonationsTable = this._toggleDonationsTable.bind(this);
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
				3: () => this._getPaymentInfoCard(),
				4: () => this._getLastCard()
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
			hasBeenSubmitted: false,
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

	_handleOnChange(e, hasError) {
		let formData = Object.assign({}, this.state.formData);
		formData[e.target.name] = e.target.value;

		this.setState({
			formData,
			hasError
		});
	}

	_handleOnSubmit(e) {
		e.preventDefault();
		fetch("/api/donation", {
			method: "POST",
			body: JSON.stringify({donation: this.state.formData}),
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
		.then((response) => {
			console.log("Thank you for your donation!");
			e.preventDefault();
			this.setState({ hasBeenSubmitted: true })
		})
	}

	_handleOnError(hasError) {
		this.setState({hasError});
	}

	_getNextFormCard() {
		this.setState((prevState) => {
			let nextFormIdx = prevState.currentFormIdx + 1;
			return {
				currentFormIdx: nextFormIdx,
				hasNextForm: (nextFormIdx < this.totalFormGroups),
				hasPreviousForm: true,
				hasBeenSubmitted: false
			}
		});
	}

	_getPreviousFormCard() {
		this.setState((prevState) => {
			let nextFormIdx = prevState.currentFormIdx - 1;
			return {
				currentFormIdx: nextFormIdx,
				hasNextForm: (this.totalFormGroups > 1),
				hasPreviousForm: (nextFormIdx > 0),
				hasBeenSubmitted: false
			}
		});
	}

	_getLastCard() {
		return <SummaryPane formData={this.state.formData} formLabels={LABELS}/>;
	}

	_getThankYouCard() {
		return (
			<FormPane>
				<h2>{`You're awesome ${this.state.formData.firstName}!`}</h2>
				<div>{`Your donation of ${this.state.formData.donationAmount} was received.`}</div>
			</FormPane>
		);
	}

	_toggleDonationsTable() {
		this.setState({ showTable: !this.state.showTable });
		this.props.toggleDonationsTable();
	}

	// FORM SECTIONS

	_getDonationAmountCard() {
		return (
			<FormPane
				formHeader={"Donation amount"}
				formInputs={{
					donationAmount: {
						displayName: LABELS.donationAmount,
						placeholder: "Or enter in an amount",
						value: this.state.formData.donationAmount,
						required: true,
						isValid: (field) => {
							const fieldValue = field ? field.replace(/\$/g, "") : "";
							return validator.isCurrency(fieldValue);
						}
					}
				}}
				onChange={this._handleOnChange}
				onError={this._handleOnError}
			>
				<div className="button-wrapper">
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$50"/>
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$100"/>
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$150"/>
					<input type="button" name="donationAmount" onClick={this._handleOnChange} value="$300"/>
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
						required: true
					},
					lastName: {
						placeholder: LABELS.lastName,
						value: this.state.formData.lastName,
						required: true
					},
					email: {
						placeholder: LABELS.email,
						value: this.state.formData.email,
						required: true,
						isValid: (field) => {
							return validator.isEmail(field)
						}
					},
					phoneNumber: {
						placeholder: LABELS.phoneNumber,
						value: this.state.formData.phoneNumber
					}
				}}
				onChange={this._handleOnChange}
				onError={this._handleOnError}
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
						required: true
					},
					city: {
						placeholder: LABELS.city,
						value: this.state.formData.city,
						required: true
					},
					state: {
						placeholder: LABELS.state,
						value: this.state.formData.state,
						required: true
					},
					zip: {
						placeholder: LABELS.zip,
						value: this.state.formData.zip,
						required: true
					}
				}}
				onChange={this._handleOnChange}
				onError={this._handleOnError}
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
						required: true
					},
					cvv: {
						placeholder: LABELS.cvv,
						value: this.state.formData.cvv,
						required: true
					},
					expireMonth: {
						placeholder: LABELS.expireMonth,
						value: this.state.formData.expireMonth,
						required: true
					},
					expireYear: {
						placeholder: LABELS.expireYear,
						value: this.state.formData.expireYear,
						required: true
					}
				}}
				onChange={this._handleOnChange}
				onError={this._handleOnError}
			/>
		);
	}

	render() {
		const stepIndex = this.state.currentFormIdx;

		// Unfortunately mui does not support class names... Not the best mobile experience
		return (
			<div style={{
				width: '100%',
				maxWidth: 1000,
				margin: 'auto',
				backgroundColor: "#ffffff"
			}}>
				<form onSubmit={this._handleOnSubmit}>
					<Stepper activeStep={stepIndex} style={{ padding: "0 3em 0 1.5em", display: "flex"}}>
						<Step>
							<StepLabel style={{ fontFamily: "Karla, sans-serif", textTransform: "uppercase" }}>
								Donation amount
							</StepLabel>
						</Step>
						<Step>
							<StepLabel style={{ fontFamily: "Karla, sans-serif", textTransform: "uppercase" }}>
								Donor information
							</StepLabel>
						</Step>
						<Step>
							<StepLabel style={{ fontFamily: "Karla, sans-serif", textTransform: "uppercase" }}>
								Billing address
							</StepLabel>
						</Step>
						<Step>
							<StepLabel style={{ fontFamily: "Karla, sans-serif", textTransform: "uppercase" }}>
								Payment information
							</StepLabel>
						</Step>
						<Step>
							<StepLabel style={{ fontFamily: "Karla, sans-serif", textTransform: "uppercase" }}>
								Donation summary
							</StepLabel>
						</Step>
					</Stepper>

					{ this.state.hasNextForm && !this.state.hasBeenSubmitted
						? (this.state.formGroups[this.state.currentFormIdx])()
						: this._getThankYouCard()
					}

					<div className="actions-wrapper">
						<div>
							<button type="button" onClick={this._clearForm}>
								Start over
							</button>
							<button type="button" onClick={this._toggleDonationsTable}>
								{
									this.state.showTable
									? "Hide table"
									: "See who else donated!"
								}
							</button>
						</div>
						<div>
							<button
								className={!this.state.hasPreviousForm ? "disabled" : ""}
								type="button"
								onClick={this._getPreviousFormCard}
								disabled={!this.state.hasPreviousForm}>
								Go back
							</button>

							{ (this.state.currentFormIdx < this.totalFormGroups - 1)
								? <button type="button"
							          className={this.state.hasError ? "disabled" : ""}
							          onClick={this._getNextFormCard} disabled={this.state.hasError}>Next</button>
								: <input
									type="submit"
									value="Submit"
									className={this.state.hasBeenSubmitted ? "disabled" : ""}
									disabled={this.state.hasBeenSubmitted} />
							}
						</div>
					</div>


				</form>
			</div>
		)
	}
};

Form.propTypes = {
	toggleDonationsTable: PropTypes.func
}