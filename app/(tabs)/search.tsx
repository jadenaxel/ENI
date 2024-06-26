import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useInterstitialAd } from "react-native-google-mobile-ads";

import { Loader, useFetch, Error, CategoriesCard as CCard, Card } from "@/components";
import { Ads, Colors, Query, Sizes, Constants } from "@/config";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Search: FC = (): JSX.Element => {
	const [search, setSearch] = useState<string>("");
	const [searchData, setSearchData] = useState<any>([]);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { state, dispatch }: any = useContext(Context);
	const { data, isLoading, error } = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.Categories });
	const { darkMode, Data } = state;

	const deviceColor: ColorSchemeName = useColorScheme();

	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const { series, movie } = Data;

	const handleSearch = (e: any) => {
		if (e.length === 0) {
			cleanUp();
			return;
		}

		setSearch(e);

		const SeriesFiler = series.filter((item: any) => item.title.toLowerCase().includes(search.toLowerCase()));
		const MovieFiler = movie.filter((item: any) => item.title.toLowerCase().includes(search.toLowerCase()));

		setSearchData([...SeriesFiler, ...MovieFiler]);
	};

	const cleanUp = (): void => {
		setSearch("");
		setSearchData([]);
	};

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;
	if (error[0]) return <Error deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.search}>
					<View
						style={[
							styles.searchBarContent,
							{
								borderColor: Constants.ColorTypeTwo("background", deviceColor, DarkModeType),
								backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType),
							},
						]}
					>
						<Feather name="search" size={20} color={Constants.ColorType("text", deviceColor, DarkModeType)} />
						<TextInput
							placeholder="Busca peliculas, series, animes, etc..."
							style={[styles.searchBar, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}
							placeholderTextColor={Constants.ColorType("text", deviceColor, DarkModeType)}
							onChangeText={handleSearch}
							defaultValue={search}
						/>
					</View>
					<Pressable onPress={cleanUp}>
						<Text style={[styles.searchCancel, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Cancelar</Text>
					</Pressable>
				</View>
				{search.length > 0 && searchData.length <= 0 && (
					<View style={styles.noresult}>
						<Text style={[styles.noresulttext, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>No hay resultados</Text>
					</View>
				)}
				{search.length <= 0 && (
					<View>
						<View>
							<Text style={[styles.descubreTitle, , { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Descubre</Text>
							<View style={styles.descubre}>
								{data
									.sort((a: any, b: any) => a.title.localeCompare(b.title))
									.map((item: any, i: number) => {
										if (!Constants.CATEGORIES.includes(item.title)) return null;

										return (
											<Link key={i} href={"/(search)/categories"} asChild>
												<Pressable
													onPress={() => {
														dispatch({ type: Actions.Categories, payload: item });
														if (isLoaded) show();
													}}
													style={styles.descubreCard}
												>
													<CCard title={item.title} deviceColor={deviceColor} DarkModeType={DarkModeType} />
												</Pressable>
											</Link>
										);
									})}
							</View>
						</View>
						<View>
							<Text style={[styles.categoriesTitle, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Categorias</Text>
							<View style={styles.categories}>
								{data
									.sort((a: any, b: any) => a.title.localeCompare(b.title))
									.map((item: any, i: number) => {
										if (Constants.CATEGORIES.includes(item.title)) return null;

										return (
											<Link key={i} href={"/(search)/categories"} asChild>
												<Pressable
													onPress={() => {
														dispatch({ type: Actions.Categories, payload: item });
														if (isLoaded) show();
													}}
													style={styles.categoriesCard}
												>
													<CCard title={item.title} deviceColor={deviceColor} DarkModeType={DarkModeType} />
												</Pressable>
											</Link>
										);
									})}
							</View>
						</View>
					</View>
				)}
				<View style={styles.searchData}>
					{searchData.length > 0 &&
						searchData.map((item: any, i: number) => {
							return (
								<Link key={i} href={"/(content)/item"} asChild>
									<Pressable
										onPress={() => {
											dispatch({ type: Actions.SeriesItem, payload: { item: item._id } });
											if (isLoaded) show();
										}}
									>
										<Card item={item} deviceColor={deviceColor} DarkModeType={DarkModeType} />
									</Pressable>
								</Link>
							);
						})}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	search: {
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 30,
		justifyContent: "space-between",
		alignItems: "center",
		gap: 15,
	},
	searchBarContent: {
		alignItems: "center",
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 6,
		flex: 1,
		paddingHorizontal: 10,
	},
	searchBar: {
		fontSize: Sizes.ajustFontSize(13),
		paddingHorizontal: 10,
		paddingVertical: 5,
		flex: 1,
	},
	searchCancel: {
		fontSize: Sizes.ajustFontSize(15),
	},
	noresult: {
		alignItems: "center",
		justifyContent: "center",
		height: Sizes.windowHeight / 1.4,
	},
	noresulttext: {
		fontSize: Sizes.ajustFontSize(20),
	},
	descubreTitle: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 20,
	},
	descubre: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginBottom: 20,
	},
	descubreCard: {
		flex: 1,
	},
	categoriesTitle: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		marginBottom: 20,
	},
	categories: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 10,
		marginBottom: 20,
	},
	categoriesCard: {
		width: Sizes.windowWidth / 2.3,
	},
	searchData: {
		flexDirection: "row",
		gap: 10,
		flexWrap: "wrap",
		marginBottom: 20,
	},
});

export default Search;
