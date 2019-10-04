import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './Landing';
import SignIn from './components/Auth/SignIn';
// import OnBoard from './components/Auth/OnBoard';

ReactDOM.render(
	<BrowserRouter>
  		<Header />
  		<Switch>
			<Route exact path='/' component={Landing} />
			<Route path='/signin' component={SignIn} />
// <Route path='/onboard' component={OnBoard} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('app')
);
