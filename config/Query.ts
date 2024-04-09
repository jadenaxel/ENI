export default {
	Home: {
		Query: "https://cq8lnnm2.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_type%3D%3D%22series%22%5D%7Bcover%7Basset-%3E%7D%2Cdescription%2Ctitle%7D",
		QROQ: `*[_type == "series"]{
                    cover{
                        asset->
                    },
                    description,
                    title
                }`,
	},
};
