import * as SQLite from "expo-sqlite";

import { DB, Query } from "@/config";
import { Actions } from "@/Wrapper";

const DB_NAME: string = "category.db";
const DB_VERSION: string = "1.0.0";

const doFetch = async (uri: string, dispatch?: any, action?: any): Promise<any> => {
	const request: Response = await fetch(uri);
	const response: any = await request.json();
	if (!request.ok && request.status !== 200) return [];
	action && dispatch({ type: action, payload: response.result });
	return response.result;
};

const Database = async ({ setCategories, dispatch }: any) => {
	const db: SQLite.SQLiteDatabase = SQLite.openDatabase(DB_NAME, DB_VERSION);

	const lasTimeIn: any = [];
	const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });

	await db.transactionAsync(async (tx: any) => {
		await tx.executeSqlAsync(DB.CREATE_TABLE_LAST_TIME_IN);
		await tx.executeSqlAsync(DB.CREATE_TABLE_CATEGORIES);
	});

	await db.transactionAsync(async (tx: any) => {
		const getLastTimeIn = await tx.executeSqlAsync(DB.GET_COLUMNS_LAST_TIME_IN);
		getLastTimeIn.rows.length > 0 && lasTimeIn.push(getLastTimeIn.rows[0].lastimein);
		await tx.executeSqlAsync(DB.SAVE_COLUMNS_LAST_TIME_IN, [date]);
	});

	await db.transactionAsync(async (tx: any) => {
		const getCategories = await tx.executeSqlAsync(DB.GET_COLUMNS_CATEGORIES);
		if (getCategories.rows.length > 0) {
			const result = await doFetch(Query.CheckNewCategories.Query(lasTimeIn[0]));
			const alreadyExists = getCategories.rows.filter((c: any) => result.some((re: any) => re._id === c._id));

			if (alreadyExists.length > 0) {
				const differentName = getCategories.rows.filter((c: any) => result.some((re: any) => re._id === c._id && re.title !== c.title));
				if (differentName.length > 0) {
					const all = getCategories.rows.filter((c: any) => result.some((re: any) => re._id !== c._id));
					await result.map(async (category: any) => await tx.executeSqlAsync(DB.UPDATE_COLUMN_CATEGORIES, [category.title, category._id]));
					setCategories([...all, ...result]);
					return;
				}
				setCategories(getCategories.rows);
				return;
			}
			await result.map(async (category: any) => await tx.executeSqlAsync(DB.SAVE_COLUMNS_CATEGORIES, [category.title, category._id]));
			setCategories([...result, ...getCategories.rows]);
		} else {
			const cate = await doFetch(Query.Search.Query, dispatch, Actions.Categories);
			setCategories(cate);
			await cate.map(async (category: any) => await tx.executeSqlAsync(DB.SAVE_COLUMNS_CATEGORIES, [category.title, category._id]));
		}
	});

	await db.closeAsync();
};

export default Database;
