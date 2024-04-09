export default {
	Home: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=%7B%22series%22%3A*%5B_type%3D%3D%22series%22%5D%7Bbackground%7Basset-%3E%7D%2Cdescription%2Ctitle%2Ccover%7Basset-%3E%7D%2Cseason%5B0..-1%5D-%3E%7Btitle%2Cchapter%5B0..-1%5D-%3E%7Blink%2Ctitle%7D%7D%7D%2C%22movie%22%3A*%5B_type%3D%3D%22movies%22%5D%7Bdescription%2Ccover%7Basset-%3E%7D%2Cbackground%7Basset-%3E%7D%2Clink%2Ctitle%7D%7D",
		QROQ: `{"series":*[_type=="series"]{background{asset->},description,title,cover{asset->},season[0..-1]->{title,chapter[0..-1]->{link,title}}},"movie":*[_type=="movies"]{description,cover{asset->},background{asset->},link,title}}`,
	},
};
