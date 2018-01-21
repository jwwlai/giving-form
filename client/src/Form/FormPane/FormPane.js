import React from "react";
import PropTypes from "prop-types";
import "./FormPane.css";

class FormPane extends React.Component {
	constructor(props) {
		super(props);

		this._handleOnBlur = this._handleOnBlur.bind(this);
		this._handleOnChange = this._handleOnChange.bind(this);
		this.state = {
			errors: {}
		};
	}

	_handleOnBlur(formInput, evt) {
		if (formInput && formInput.required && evt.target.value === "") {
			this.setState({ [`errors_${evt.target.name}`]: `This field is required.` });
		} else {
			this.setState({ [`errors_${evt.target.name}`]: null });
		}
	}

	_handleOnChange(formInput, evt) {
		if (formInput && formInput.isValid()) {
			this.setState({ [`errors_${evt.target.name}`]: null });
		}

		this.props.onChange(evt);
	}

	render() {
		return (
			<div className="form-card">
				<h2>{this.props.formHeader}</h2>
				<div className="form-body">
					{ this.props.children
						? this.props.children
						: null
					}

					{ this.props.formInputs && Object.keys(this.props.formInputs).map((key) => (
						<div className="input-wrapper" key={key}>
							<input
								name={key}
								placeholder={this.props.formInputs[key].placeholder}
								onChange={this.props.onChange}
								onBlur={this._handleOnBlur.bind(this, this.props.formInputs[key])}
								value={this.props.formInputs[key].value}
							/>
							{
								this.state[`errors_${key}`]
								? <p>{this.state[`errors_${key}`]}</p>
								: null
							}
						</div>
					  ))
					}
				</div>
			</div>
		);
	}
}

FormPane.propTypes = {
	formHeader: PropTypes.string.isRequired,
	formInputs: PropTypes.object,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	validators: PropTypes.array
};

export default FormPane;