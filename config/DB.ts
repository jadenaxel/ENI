export default {
	CREATE_TABLE_MOVIES:
		"CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT, background TEXT, cover TEXT, description TEXT, trailer TEXT, year TEXT, _createdAt TEXT, catgegory_id INT, FOREIGN KEY (catgegory_id) REFERENCES categories (id) )",
	CREATE_TABLE_SERIES:
		"CREATE TABLE IF NOT EXISTS series (id INTEGER PRIMARY KEY, title TEXT, background TEXT, cover TEXT, description TEXT, trailer TEXT, year TEXT, _createdAt TEXT, catgegory_id INT, FOREIGN KEY (catgegory_id) REFERENCES categories (id) )",
	CREATE_TABLE_CATEGORIES: "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, title TEXT)",
	CREATE_TABLE_SEASON: "",
	CREATE_TABLE_LINKS: "",
	CREATE_TABLE_LINK: "",
	CREATE_TABLE_WATCHES: "",
	CREATE_TABLE_WATCh: "",

	SAVE_COLUMNS_MOVIE: "INSERT INTO movies (title, background, cover, description, trailer, year, _createdAt, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
	SAVE_COLUMNS_SERIES: "INSERT INTO series (title, background, cover, description, trailer, year, _createdAt, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
	SAVE_COLUMNS_CATEGORIES: "INSERT INTO categories (title) VALUES (?)",

	GET_COLUMNS_MOVIE: "SELECT * FROM movies",
	GET_COLUMNS_SERIES: "SELECT * FROM series",
	GET_COLUMNS_CATEGORIES: "SELECT * FROM categories",

	// await tx.executeSqlAsync("INSERT INTO movies (name) values (?)", ["Hola"]);
};
