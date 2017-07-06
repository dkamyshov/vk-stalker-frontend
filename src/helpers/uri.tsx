const buildURI = (base: string, options: any) => options ? base + '?' + Object.keys(options).map(key => `${key}=${options[key]}`).join('&') : base;

export default buildURI;