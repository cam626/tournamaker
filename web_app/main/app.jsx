const {Route, Router, IndexRoute, hashHistory} = require('react-router');
const React = require('react');
const ReactDOM = require('react-dom');

const Main = require('Main');
 const Weather = require('Weather');
 const About = require('About');
 const Examples = require('Examples');

ReactDOM.render(
  <Router history={hashHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Weather}/>
			<Route path="about" component={About}/>
			<Route path="examples" component={Examples}/>
		</Route>
  </Router>,
  document.getElementById('app')
);
