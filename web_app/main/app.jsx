import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './Landing';
import _404 from './_404';
import SignIn from './components/Auth/SignIn';
import OnBoard from './components/Auth/OnBoard';

ReactDOM.render(
	<BrowserRouter>
  		<Header />
  		<Switch>
			<Route exact path='/' component={Landing} />
			<Route path='/signin' component={SignIn} />
			<Route path='/onboard' component={OnBoard} />
			<Route path='*' component={_404} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('app')
);
