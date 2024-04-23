import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async (type: string, _id?: string): Promise<any> => {
	try {
		const data: any = await AsyncStorage.getItem(type);
		const parsing = JSON.parse(data);
		if (parsing === null || parsing.length <= 0) return [];
		const getTitle: any = parsing?.filter((item: any) => item._id === _id);
		if (_id) return getTitle;
		return parsing;
	} catch (e: any) {
		console.log(e.message);
	}
};

const saveData = async (type: string, state: any): Promise<void> => {
	try {
		const data: any = await AsyncStorage.getItem(type);
		const parsing = JSON.parse(data);
		if (parsing === null || parsing.length <= 0) await AsyncStorage.setItem(type, JSON.stringify([state]));
		else await AsyncStorage.setItem(type, JSON.stringify([...parsing, state]));
	} catch (e: any) {
		console.log(e.message);
	}
};

const removeData = async (type: string, item?: any): Promise<void> => {
	try {
		const data: any = await AsyncStorage.getItem(type);
		const parsing = JSON.parse(data);
		if (!item) {
			await AsyncStorage.setItem(type, JSON.stringify(""));
			return;
		}
		if (parsing === null || parsing.length <= 0) return;
		const deleteItem = parsing?.filter((items: any) => items._id !== item);
		await AsyncStorage.setItem(type, JSON.stringify(deleteItem));
	} catch (e: any) {
		console.log(e.message);
	}
};

export default {
	getData,
	saveData,
	removeData,
};
