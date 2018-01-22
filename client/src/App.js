import React, {Component} from 'react';
import Form from "./Form";
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			toggleDonationsTable: false
		};

		this._toggleDonationsTable = this._toggleDonationsTable.bind(this);
	}

	_toggleDonationsTable() {
		this.setState({ loadingDonationsTable: true });

		if (this.state.toggleDonationsTable) {
			// close it
			this.setState({ toggleDonationsTable: false });
		} else {
			fetch("/api/donations", {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json"
				})
			})
			.then((response) => response ? response.json() : null)
			.then((data) => {
				// Render the table
				this.setState({
					toggleDonationsTable: true,
					tableData: data
				});
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					toggleDonationsTable: true,
					tableData: null
				});
			});
		}
	}

	render() {
		return (
			<MuiThemeProvider>
				<div>
					<div className="container">
						<Form toggleDonationsTable={this._toggleDonationsTable}/>
					</div>
					{ this.state.toggleDonationsTable && this.state.tableData && (
						<div className="wrapper">
							<div className="table-container">
								<div className="table-header">
									<h2>{`Total donations: $${this.state.tableData.totalDonations}`}</h2>
								</div>
								<div className="table">
									{
										<div className="row">
											<span>First Name</span>
											<span>Last Name</span>
											<span>Donation amount</span>
										</div>
									}
									{
										this.state.tableData.summaryInfo.map((item) => (
											<div className="row">
												<span>{item.firstName}</span>
												<span>{item.lastName}</span>
												<span>${item.donationAmount}</span>
											</div>
										))
									}
								</div>
							</div>
						</div>
					)}

					{
						(this.state.toggleDonationsTable && !this.state.tableData) && (
							<div className="wrapper">
								<div className="table-container">
									<p style={{ padding: "1em" }}>No donations yet!</p>
								</div>
							</div>
						)
					}
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
