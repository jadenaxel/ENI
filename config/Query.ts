const GetContent = (id: string) => {
	return `https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_id+%3D%3D+%22${id}%22%5D%7B_id%2C_createdAt%2CbackgroundURL%2Cyear%2Ctrailer%2Cdescription%2Ctitle%2CcoverURL%2Cseason%5B0..-1%5D-%3E%7Btitle%2Cchapter%5B0..-1%5D-%3E%7Blinks%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Cwatches%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Ctitle%2Cnote%2Clike%2Cdislike%7D%7D%2Ccategories%5B0..-1%5D-%3E%7Btitle%7D%2C+like%2C+dislike%2Clinks%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%2Cwatches%5B%5D-%3E%7Blink%2Clang%5B0..-1%5D%7Basset-%3E%7D%7D%7D`;
};

export default {
	Home: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=%7B%22series%22%3A+*%5B_type%3D%3D%22series%22%5D%7Corder%28_createdAt+desc%29%7B_id%2Ctitle%2CbackgroundURL%2CcoverURL%2Clike%2C_createdAt%2Cseason%2Ccategories%5B0..-1%5D-%3E%7B_id%2Ctitle%7D%7D%2C%22movie%22%3A*%5B_type%3D%3D%22movies%22%5D%7Corder%28_createdAt+desc%29%7B_id%2Ctitle%2CbackgroundURL%2CcoverURL%2Clike%2C_createdAt%2Ccategories%5B0..-1%5D-%3E%7B_id%2Ctitle%7D%7D%7D",
		QROQ: `{"series": *[_type=="series"]|order(_createdAt desc){_id,title,backgroundURL,coverURL,like,_createdAt,season,categories[0..-1]->{_id,title}},"movie":*[_type=="movies"]|order(_createdAt desc){_id,title,backgroundURL,coverURL,like,_createdAt,categories[0..-1]->{_id,title}}}`,
	},
	Content: {
		Query: GetContent,
		QROQ: `*[_id == "5eead716-9c4b-492f-bcff-ef442e4cbb0b"]{_id,_createdAt,backgroundURL,year,trailer,description,title,coverURL,season[0..-1]->{title,chapter[0..-1]->{links[]->{link,lang[0..-1]{asset->}},watches[]->{link,lang[0..-1]{asset->}},title,note,like,dislike}},categories[0..-1]->{title}, like, dislike,links[]->{link,lang[0..-1]{asset->}},watches[]->{link,lang[0..-1]{asset->}}}`,
	},
	Search: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_type%3D%3D%22categories%22%5D+%7C+order%28title+asc%29%7B_id%2Ctitle%7D",
		QROQ: `*[_type=="categories"] | order(title asc){_id,title}`,
	},
};
