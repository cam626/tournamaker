const defaultResponse = (response) => {
	const copy = response.clone();
	return response.json().then((data)=>{
		if(!response.ok){
			return Promise.reject(data.error);
		}
		return data;
	}).catch(() => copy.text()
	.then((txt) => Promise.reject(txt)));
}

export default defaultResponse;
