import ReactDOM from 'react-dom';
import React from 'react';

import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

import { HashRouter } from 'react-router-dom';
import Authenticator from './components/Auth/Authenticator';
import Routes from './components/Routes';
import Header from './components/Header';
import Landing from './Landing';
import _404 from './_404';
import SignIn from './components/Auth/SignIn';
import User from './components/User/User';
import DisplayName from './components/User/DisplayName';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
  			<Authenticator page={Routes} />
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('app')
);
