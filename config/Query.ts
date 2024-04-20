export default {
	Home: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=%7B%22series%22%3A*%5B_type%3D%3D%22series%22%5D+%7C+order%28_createdAt+desc%29+%7B_createdAt%2CbackgroundURL%2Cbackground%7Basset-%3E%7D%2Cyear%2Ctrailer%2Cdescription%2Ctitle%2Ccover%7Basset-%3E%7D%2CcoverURL%2Cseason%5B0..-1%5D-%3E%7Btitle%2Cchapter%5B0..-1%5D-%3E%7Blink%2Clinks%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Cwatch%2Cwatches%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Ctitle%2Cnote%7D%7D%2Ccategories%5B0..-1%5D-%3E%7Btitle%7D%7D%2C%22movie%22%3A*%5B_type%3D%3D%22movies%22%5D%7C+order%28_createdAt+desc%29%7B_createdAt%2Cdescription%2Cyear%2Ccover%7Basset-%3E%7D%2CcoverURL%2Cbackground%7Basset-%3E%7D%2CbackgroundURL%2Ctrailer%2Clink%2Clinks%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Cwatch%2Cwatches%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Ctitle%2Ccategories%5B0..-1%5D-%3E%7Btitle%7D%7D%7D",
		QROQ: `{"series":*[_type=="series"] | order(_createdAt desc) {_createdAt,backgroundURL,background{asset->},year,trailer,description,title,cover{asset->},coverURL,season[0..-1]->{title,chapter[0..-1]->{link,links[]->{link,lang[0..-1]{asset->}},watch,watches[]->{link,lang[0..-1]{asset->}},title,note}},categories[0..-1]->{title}},"movie":*[_type=="movies"]| order(_createdAt desc){_createdAt,description,year,cover{asset->},coverURL,background{asset->},backgroundURL,trailer,link,links[]->{link,lang[0..-1]{asset->}},watch,watches[]->{link,lang[0..-1]{asset->}},title,categories[0..-1]->{title}}}`,
	},
	Search: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_type%3D%3D%22categories%22%5D%7B%0A++title%0A%7D",
		QROQ: `*[_type=="categories"]{title}`,
	},
};
