const defaultResponse = (response) => {
	const copy = response.clone();
	return response.json()
	.catch(() => copy.text()
		.then((txt) => {
			if (txt == 'Success')
				return Promise.resolve(txt);
			return Promise.reject(txt)
	}))
	.then((data)=>{
		if(!response.ok)
			return Promise.reject(data.error);
		return data;
	});
}

export default defaultResponse;
