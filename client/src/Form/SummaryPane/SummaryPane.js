import React from 'react';
import PropTypes from 'prop-types';
import FormPane from "../FormPane";
import "./SummaryPane.css";

export default class SummaryPane extends React.Component {
	render() {
		return (
			<FormPane formHeader={"Donation summary"}>
				{
					Object.keys(this.props.formData).map((field) => {
						return (
							<div key={field} className="row">
								<span>{this.props.formLabels[field]}</span>
								<span>{this.props.formData[field]}</span>
							</div>
						)
					})
				}
			</FormPane>
		);
	}
}

SummaryPane.propTypes = {
	formData: PropTypes.object,
	formLabels: PropTypes.object,
	donationAmount: PropTypes.string
};