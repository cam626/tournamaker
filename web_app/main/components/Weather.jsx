const React = require('react');
const WeatherForm = require('./WeatherForm');
const WeatherResults = require('./WeatherResults');
const OpenWeatherMap = require('../api/OpenWeatherMap');

export default class Weather extends React.Component {
	getInitialState() {
		return {
			weather: "It's 78 degrees in Philidelhia"
		};
	}

	handleNewData(updates) {
		OpenWeatherMap.getTemp(updates.city).then(temp => {
			updates.weather = "It's " + temp + " degrees in " + updates.city;
			this.setState(updates);
		}, error => {
			updates.weather = "Error " + error.message;
			this.setState(updates);
		})
		updates.weather = "Loading...";
		this.setState(updates);
	}

	render() {
		return (
			<div>
				<WeatherForm onNewData={this.handleNewData}/>
				<WeatherResults weather={this.state.weather}/>
			</div>
		);
	}
}
