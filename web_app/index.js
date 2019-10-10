const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

// const csp = require(`helmet-csp`)
// app.use(csp({
// 	directives: {
//     	defaultSrc: ["'self'"]
// 	}
// }));

app.use(function (req, res, next) {
 	if (req.headers['x-forwarded-proto'] === 'https') {
		res.redirect('http://' + req.hostname + req.url);
	} else {
		next();
	}
});

app.use(express.static(__dirname));

app.listen(PORT, function () {
	console.log('Express server is up on port ' + PORT);
});
