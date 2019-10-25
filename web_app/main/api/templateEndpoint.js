fetch('http://example.com/api/endpoint/', {
	method: 'GET',
	headers: {
		Authorization: `Bearer ${userIdToken}`
	},

	body: JSON.stringify({
		name: myName,
		password: myPassword
	})
}).then((response) => {
	// do something awesome that makes the world a better place
	return response.displayName;
}).catch((error) => {

});
