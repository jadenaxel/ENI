import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, FlatList, Pressable, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";

import { Colors, Ads, Sizes, LocalStorage, Query, Constants, DB } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card_Section, Title, Home_Slider, Home_Dot } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string =
	//  __DEV__ ? TestIds.INTERSTITIAL :
	Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const DATA_SIZE_CONTENT: number = 10;

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [series, setSeries] = useState<any>([]);
	const [movie, setMovies] = useState<any>([]);
	const [slider, setSlider] = useState<any>([]);
	// const [Categories, setCategories] = useState<any>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [appstore, setAppStore] = useState<string>("");

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });

	const Categories: any = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.All }).data;

	const scrollX: any = useRef(new Animated.Value(0)).current;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const PrincipalColor: string = state.colorOne;
	const CanLoad: boolean = state.BannerAd === "Load";

	const getLocalData = async (): Promise<void> => {
		const LocalData = await LocalStorage.getData("appstore");
		const realData = LocalData.length > 0 ? LocalData[0] : state.store;
		setAppStore(realData);
	};

	const handleOnScroll = (event: any) => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })(event);

	const doFetch = async (uri: string, save: any, type?: any): Promise<void> => {
		const request: Response = await fetch(uri);
		const response: any = await request.json();
		save(type ? [...response.result[type]] : response.result);
		setLoading(false);
		type && dispatch({ type: Actions.All, payload: response.result });
	};

	const Database = async () => {
		const db: SQLite.SQLiteDatabase = SQLite.openDatabase("movies.db", "1.0.19");

		await db.transactionAsync(async (tx: any) => {
			await db.execAsync([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false);
			await tx.executeSqlAsync(DB.CREATE_TABLE_MOVIES);
			await tx.executeSqlAsync(DB.CREATE_TABLE_SERIES);
			await tx.executeSqlAsync(DB.CREATE_TABLE_CATEGORIES);

			const getMovies = await tx.executeSqlAsync(DB.GET_COLUMNS_MOVIE);
			const getSeries = await tx.executeSqlAsync(DB.GET_COLUMNS_SERIES);
			const getCategories = await tx.executeSqlAsync(DB.GET_COLUMNS_CATEGORIES);

			if (getCategories.rows.length > 0) {
				setCategories(getCategories.rows);
				setLoading(false);
			} else {
				await doFetch(Query.Search.Query, setCategories);
				Categories.forEach(async (ca: any) => {
					await tx.executeSqlAsync(DB.SAVE_COLUMNS_CATEGORIES, [ca.title]);
					setLoading(false);
				});
			}

			if (getMovies.rows.length > 0) {
				setAllData((prev: any) => [...prev, ...getMovies.rows]);
				setMovies(getMovies.rows);
				setSlider((prev: any) => [...prev, ...getMovies.rows.slice(0, 5)]);
				setLoading(false);
			} else {
				await doFetch(Query.Home.Query, setMovies, "movie");
				movie.forEach(async (movies: any) => {
					await tx.executeSqlAsync(DB.SAVE_COLUMNS_MOVIE, [
						movies.title,
						movies.backgroundURL,
						movies.coverURL,
						movies.description,
						movies.trailer,
						movies.year,
						movies._createdAt,
					]);
				});
			}

			if (getSeries.rows.length > 0) {
				setAllData((prev: any) => [...prev, ...getSeries.rows]);
				setSlider((prev: any) => [...prev, ...getSeries.rows.slice(0, 5)]);
				setLoading(false);
			} else {
				await doFetch(Query.Home.Query, setSeries, "series");
				series.forEach(async (serie: any) => {
					await tx.executeSqlAsync(DB.SAVE_COLUMNS_SERIES, [
						serie.title,
						serie.backgroundURL,
						serie.coverURL,
						serie.description,
						serie.trailer,
						serie.year,
						serie._createdAt,
					]);
					setLoading(false);
				});
			}
		});
		await db.closeAsync();
	};

	useEffect(() => {
		getLocalData();
		// Database();
	}, []);

	useEffect(() => {
		if (data.hasOwnProperty("movie")) {
			setAllData([...data.movie.slice(0, 5), ...data.series.slice(0, 5)]);
			setLoading(false);
		}
	}, [isLoading]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (error[0]) return <Error deviceColor={deviceColor} DarkModeType={DarkModeType} />;
	if (isLoading && loading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView
			style={[
				styles.main,
				{ backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) },
				CanLoad && Constants.IsDev && { paddingBottom: 70 },
			]}
		>
			{Constants.IsDev && CanLoad && <AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />}
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ paddingHorizontal: Sizes.paddingHorizontal }}>
					<Title title="Inicio" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				</View>
				<FlatList
					horizontal
					disableVirtualization
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					snapToAlignment="center"
					renderItem={({ item }) => (
						<Link href={"/(content)/item"} asChild>
							<Pressable
								onPress={() => {
									dispatch({ type: Actions.SeriesItem, payload: { item, appstore } });
									if (isLoaded && Constants.IsDev) show();
								}}
							>
								<Home_Slider item={item} />
							</Pressable>
						</Link>
					)}
					data={slider?.sort((a: any, b: any) => b._createdAt?.localeCompare(a._createdAt))}
					// keyExtractor={(e) => Math.floor(Math.random() * 1000)}
					onScroll={handleOnScroll}
				/>
				<Home_Dot
					data={slider?.sort((a: any, b: any) => b._createdAt?.localeCompare(a._createdAt))}
					scrollX={scrollX}
					deviceColor={deviceColor}
					DarkModeType={DarkModeType}
					PrincipalColor={PrincipalColor}
				/>
				{Categories.sort((a: any, b: any) => a.title.localeCompare(b.title)).map((item: any, i: number) => {
					console.log("first");
					const content: any = allData
						.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt))
						.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

					if (content.length <= 0) return null;

					return (
						<Card_Section
							key={i}
							data={content}
							title={item.title}
							dispatch={dispatch}
							isLoaded={isLoaded}
							show={show}
							appstore={appstore}
							DATA_SIZE_CONTENT={DATA_SIZE_CONTENT}
							deviceColor={deviceColor}
							DarkModeType={DarkModeType}
						/>
					);
				})}
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});

export default Home;
