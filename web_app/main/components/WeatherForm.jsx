const React = require('react');

module.exports = React.createClass({
	onFormSubmit(event) {
		event.preventDefault();
		if (this.refs.city.value.length > 0) {
			this.props.onNewData({
				city: this.refs.city.value
			});
		}
		this.refs.city.value = "";
	},
	render() {
		return (
			<div>
				<h1>Get Weather</h1>
				<form action="" onSubmit={this.onFormSubmit}>
					<input type="text" placeholder="Enter City Name" ref="city"/>
					<button>Get Weather</button>
				</form>
			</div>
		);
	}
});