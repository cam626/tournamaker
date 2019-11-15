const frontendHostUrl = process.env.DEV_MODE == 'development' ? 'http://localhost:8080/' : 'https://tournamaker.appspot.com/';
console.log(process.env);

export default frontendHostUrl;
