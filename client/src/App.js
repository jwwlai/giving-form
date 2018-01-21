import React, {Component} from 'react';
import Form from "./Form";
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<div className="container">
					<Form />
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
