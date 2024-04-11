import type { FC } from "react";

import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { AdBanner, Loader, useFetch, Error, CategoriesCard as CCard, Card } from "@/components";
import { Ads, Colors, Query, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Search: FC = (): JSX.Element => {
	const [search, setSearch] = useState<string>("");
	const [searchData, setSearchData] = useState<any>([]);
	const { isLoaded, load, show } = useInterstitialAd(AD_STRING);

	const { state, dispatch }: any = useContext(Context);
	const { data, isLoading, error } = useFetch({ uri: Query.Search.Query });
	state.Data !== undefined ? useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All }) : "";

	const { series, movie } = state.Data;

	const handleSearch = (e: any) => {
		setSearch(e);

		const SeriesFiler = series.filter((item: any) => item.title.toLowerCase().includes(search.toLowerCase()));
		const MovieFiler = movie.filter((item: any) => item.title.toLowerCase().includes(search.toLowerCase()));

		setSearchData([...SeriesFiler, ...MovieFiler]);
	};
	const cleanUp = () => {
		setSearch("");
		setSearchData([]);
	};

	useEffect(() => {
		load();
	}, [load]);

	if (isLoading) return <Loader />;
	if (error[0]) return <Error />;

	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.SEARCH_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.search}>
					<View style={styles.searchBarContent}>
						<Feather name="search" size={20} color={Colors.text} />
						<TextInput
							placeholder="Busca peliculas, series, animes, etc..."
							style={styles.searchBar}
							placeholderTextColor={Colors.text}
							onChangeText={handleSearch}
							defaultValue={search}
						/>
					</View>
					<Pressable onPress={cleanUp}>
						<Text style={styles.searchCancel}>Cancelar</Text>
					</Pressable>
				</View>
				{search.length <= 0 && (
					<View>
						<Text style={styles.categoriesTitle}>Descubre</Text>
						<View style={styles.categories}>
							{data.map((item: any, i: number) => {
								return (
									<Link key={i} href={"/(search)/categories"} asChild>
										<Pressable
											onPress={() => {
												dispatch({ type: Actions.Categories, payload: item });
												if (isLoaded) show();
											}}
										>
											<CCard title={item.title} />
										</Pressable>
									</Link>
								);
							})}
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
											dispatch({ type: Actions.SeriesItem, payload: item });
											if (isLoaded) show();
										}}
									>
										<Card item={item} />
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
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 70,
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
		borderColor: Colors.text,
		borderWidth: 1,
		borderRadius: 6,
		flex: 1,
		paddingHorizontal: 10,
		backgroundColor: "rgba(30, 30, 30, .9)",
	},
	searchBar: {
		fontSize: Sizes.ajustFontSize(14),
		color: Colors.text,
		paddingHorizontal: 10,
		paddingVertical: 5,
		flex: 1,
	},
	searchCancel: {
		fontSize: Sizes.ajustFontSize(15),
		color: Colors.text,
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
	},
	searchData: {
		flexDirection: "row",
		gap: 10,
		flexWrap: "wrap",
	},
});

export default Search;
