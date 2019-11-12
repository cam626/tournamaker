import ReactDOM from 'react-dom';
import React from 'react';

import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

import { HashRouter } from 'react-router-dom';
import Authenticator from './components/Auth/Authenticator';
import Routes from './components/Routes';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
  			<Authenticator page={Routes} />
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('app')
);
