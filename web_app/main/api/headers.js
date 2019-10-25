const headers = (token) => {
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	}  
}

export default headers;
