import * as SQLite from "expo-sqlite";

import { DB, Query } from "@/config";
import { Actions } from "@/Wrapper";

const doFetch = async (uri: string, dispatch: any, action?: any): Promise<any> => {
	const request: Response = await fetch(uri);
	const response: any = await request.json();
	if (!request.ok && request.status !== 200) return [];
	action && dispatch({ type: action, payload: response.result });
	return response.result;
};

// const getCategoryIdByTitle = async (tx: any, categoryTitle: any) => {
// 	const result = await tx.executeSqlAsync("SELECT id FROM categories WHERE title = ?", [categoryTitle]);
// 	return result.rows.length > 0 ? result.rows[0].id : null;
// };

// const getMoviesByCategory = async (tx: any, categoryTitle: any) => {
// 	const categoryId = await getCategoryIdByTitle(tx, categoryTitle);
// 	// console.log(categoryId);
// 	if (categoryId !== null) {
// 		const result = await tx.executeSqlAsync(
// 			`SELECT m.*
//    FROM movies m
//    JOIN movie_categories mc ON m.id = mc.movie_id
//    WHERE mc.category_id = ?`,
// 			[categoryId]
// 		);
// 		console.log(result);
// 		return result.rows;
// 	}
// 	return [];
// };

const Database = async ({ setCategories, dispatch }: any) => {
	const db: SQLite.SQLiteDatabase = SQLite.openDatabase("movieInfo.db", "1.0.0");

	const lasTimeIn: any = [];
	const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });

	// await db.execAsync([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false);

	await db.transactionAsync(async (tx: any) => {
		await tx.executeSqlAsync(DB.CREATE_TABLE_LAST_TIME_IN);
		const getLastTimeIn = await tx.executeSqlAsync(DB.GET_COLUMNS_LAST_TIME_IN);
		getLastTimeIn.rows.length > 0 && lasTimeIn.push(getLastTimeIn.rows[0].lastimein);
		await tx.executeSqlAsync(DB.SAVE_COLUMNS_LAST_TIME_IN, [date]);
	});

	await db.transactionAsync(async (tx: any) => {
		await tx.executeSqlAsync(DB.CREATE_TABLE_CATEGORIES);
		const getCategories = await tx.executeSqlAsync(DB.GET_COLUMNS_CATEGORIES);
		if (getCategories.rows.length > 0) {
			const result = await doFetch(Query.CheckNewCategories.Query(lasTimeIn[0]), dispatch);
			setCategories([...result, ...getCategories.rows]);
		} else {
			const cate = await doFetch(Query.Search.Query, dispatch, Actions.Categories);
			setCategories(cate);
			await cate.map(async (category: any) => await tx.executeSqlAsync(DB.SAVE_COLUMNS_CATEGORIES, [category.title]));
		}
	});
	// await db.transactionAsync(async (tx: any) => {
	// 	await tx.executeSqlAsync(DB.CREATE_TABLE_MOVIES);
	// 	await tx.executeSqlAsync(DB.CREATE_TABLE_MOVIES_CAT);
	// 	const getMovies = await tx.executeSqlAsync(DB.GET_COLUMNS_MOVIE);
	// 	if (getMovies.rows.length > 0) {
	// 		setMovies(getMovies.rows);
	// 		console.log("Quien");
	// 	} else {
	// 		const movieData = await doFetch(Query.Movie.Query, dispatch, Actions.Movie);
	// 		await movieData.map(async (data: any) => {
	// 			setMovies(movieData);
	// 			const movieId = await tx.executeSqlAsync(DB.SAVE_COLUMNS_MOVIE, [
	// 				data.title,
	// 				data.backgroundURL,
	// 				data.coverURL,
	// 				data.description,
	// 				data.trailer,
	// 				data.year,
	// 				data._createdAt,
	// 			]);
	// 			for (const category of data.categories) {
	// 				const categoryId = await getCategoryIdByTitle(tx, category.title);
	// 				if (categoryId !== null) await tx.executeSqlAsync(DB.SAVE_COLUMNS_MOVIE_CAT, [movieId.insertId, categoryId]);
	// 			}
	// 		});
	// 	}
	// });
	await db.closeAsync();
};

export default Database;
