import { Alert } from "react-native";

import { LocalStorage } from "@/config";

const getLikes = async (_id: string, setIsLikeActive: any, setIsLiked: any) => {
	const data = await LocalStorage.getData("like", _id);
	if (data.length <= 0) return;

	setIsLikeActive(true);

	const type = data[0].type;
	setIsLiked(type === 1);
};

const handleLike = async (
	type: number,
	setDisabledLike: any,
	isLiked: any,
	_id: string,
	setIsLiked: any,
	isLikeActive: any,
	setIsLikeActive: any,
	setNumbLike: any,
	setNumbDislikes: any
) => {
	const profile = await LocalStorage.getData("profile");
	if (profile.length <= 0) {
		Alert.alert("Debes de completar tus datos en el perfil.");
		return;
	}

	console.log(isLiked);

	setDisabledLike(true);
	setIsLiked(type === 1);

	// console.log(isLikeActive);
	if ((type === 1 && isLikeActive && isLiked === true) || (type === 0 && isLikeActive && isLiked === false)) {
		// await createSanityDocument(_id, type, true);
		await LocalStorage.removeData("like", _id);
		type === 1 ? setNumbLike((prev: any) => prev - 1) : setNumbDislikes((prev: any) => prev - 1);
		setIsLiked(undefined);
		setIsLikeActive(false);
		console.log("Si");

		setDisabledLike(false);
		return;
	}

	console.log("No");

	if (type === 1) {
		setNumbLike((prev: any) => prev + 1);
		if (isLiked) setNumbDislikes((prev: any) => (prev === 0 ? 0 : prev - 1));
	} else {
		setNumbDislikes((prev: any) => prev + 1);
		if (!isLiked) setNumbLike((prev: any) => (prev === 0 ? 0 : prev - 1));
	}

	// const result = await createSanityDocument(_id, type);

	// if (!result.results[0]["operation"]) {
	// 	setDisabledLike(false);
	// 	Alert.alert("Error al actualizar");
	// 	return;
	// }

	await LocalStorage.removeData("like", _id);
	await LocalStorage.saveData("like", { _id, type });

	setDisabledLike(false);
	setIsLikeActive(true);
};

// const createSanityDocument = async (_id: string, type: number, reverse?: boolean) => {
// 	let typeOfInc = type === 1 ? reverseLike([0], isLikeActive) : reverseLike([2]);

// 	console.log(reverse);
// 	if (reverse) typeOfInc = type === 1 ? reverseLike([1]) : reverseLike([3]);

// 	try {
// 		const result = await fetch("https://cq8lnnm2.api.sanity.io/v2022-03-07/data/mutate/production", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${Constants.Token}`,
// 			},
// 			body: JSON.stringify({
// 				mutations: [
// 					{
// 						patch: {
// 							query: `*[_id == $id]`,
// 							params: {
// 								id: _id,
// 							},
// 							setIfMissing: {
// 								like: 0,
// 								dislike: 0,
// 							},
// 							...typeOfInc,
// 						},
// 					},
// 				],
// 			}),
// 		});
// 		return await result.json();
// 	} catch (e: any) {}
// };

// const reverseLike = (incT: any, isLikeActive: any) => {
// 	const incLike = {
// 		inc: { like: 1 },
// 		dec: {
// 			dislike: isLikeActive && 1,
// 		},
// 	};
// 	const desLike = {
// 		dec: { like: 1 },
// 	};
// 	const incDislike = {
// 		inc: { dislike: 1 },
// 		dec: {
// 			like: isLikeActive && 1,
// 		},
// 	};
// 	const desDislike = {
// 		dec: {
// 			dislike: 1,
// 		},
// 	};

// 	const data = [incLike, desLike, incDislike, desDislike];

// 	return data[incT];
// };

export default { getLikes, handleLike };
