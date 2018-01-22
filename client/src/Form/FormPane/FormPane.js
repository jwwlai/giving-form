import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import lodash from "lodash";
import "./FormPane.css";

class FormPane extends React.Component {
	constructor(props) {
		super(props);

		this._handleOnBlur = this._handleOnBlur.bind(this);
		this._handleOnChange = this._handleOnChange.bind(this);
		this._isValidDebounce = this._isValidDebounce.bind(this);
		this._isValidDebounce = lodash.debounce(this._isValidDebounce, 500);
		this.state = {
			errors: {}
		};
	}

	_handleOnBlur(formInput, evt) {
		// No debounce
		const inputName = evt.target.name;
		const inputValue = evt.target.value;
		this._isValid(formInput, inputName, inputValue);
	}

	_handleOnChange(formInput, evt, newValue) {
		const inputName = evt.target.name;
		this._isValidDebounce(formInput, inputName, newValue);

		this.props.onChange(evt);
	}

	_isValid(formInput, inputName, newValue) {
		if (this._isRequired(formInput, newValue)) {
			this.setState({ [`errors_${inputName}`]: `This field is required.` });
			this.props.onError(true);
		} else if (formInput && (typeof formInput.isValid !== "undefined") && !formInput.isValid(newValue)) {
			this.setState({
				[`errors_${inputName}`]: `Please enter a valid ${formInput && formInput.displayName ? formInput.displayName : "value"}.` });
			this.props.onError(true);
		} else {
			this.setState({ [`errors_${inputName}`]: null });
			this.props.onError(false);
		}
	}

	_isValidDebounce(formInput, inputName, newValue) {
		this._isValid(formInput, inputName, newValue);
	}

	_isRequired(formInput, newValue) {
		return formInput && formInput.required && newValue === "";
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
							<TextField
								className="formInput"
								name={key}
								value={this.props.formInputs[key].value}
								onChange={this._handleOnChange.bind(this, this.props.formInputs[key])}
								onBlur={this._handleOnBlur.bind(this, this.props.formInputs[key])}
								hintText={this.props.formInputs[key].placeholder}
								floatingLabelText={this.props.formInputs[key].placeholder}
								errorText={this.state[`errors_${key}`]}
								underlineShow={false}
								fullWidth
							/>
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
	validators: PropTypes.array,
	onError: PropTypes.func,
};

export default FormPane;