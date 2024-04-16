import type { FC } from "react";

import { useContext, useState, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Colors, LocalStorage, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Card, AdBanner } from "@/components";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Categories: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [appstore, setAppStore] = useState<string>("");

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { state, dispatch }: any = useContext(Context);

	const categories = state.Categories;
	const { series, movie } = state.Data;

	const loadCategories = () => {
		const SeriesFiler = series.filter((item: any) =>
			item.categories.some((category: any) => category.title.toLowerCase() === categories.title.toLowerCase())
		);
		const MovieFiler = movie.filter((item: any) =>
			item.categories.some((category: any) => category.title.toLowerCase() === categories.title.toLowerCase())
		);

		setAllData([...SeriesFiler, ...MovieFiler]);
	};

	const getLocalData = async () => {
		const LocalData = await LocalStorage.getData("appstore");
		const realData = LocalData.length > 0 ? LocalData[0] : state.store;
		setAppStore(realData);
	};

	useEffect(() => {
		getLocalData();
	}, []);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<View style={styles.main}>
			<AdBanner ID={Ads.CATEGORIES_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={styles.title}>{categories.title}</Text>
				<View style={styles.data}>
					{allData
						.sort((a: any, b: any) => a.title.localeCompare(b.title))
						.map((item: any, i: number) => {
							return (
								<Link key={i} href={"/(content)/item"} asChild>
									<Pressable
										onPress={() => {
											dispatch({ type: Actions.SeriesItem, payload: { item, appstore } });
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
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 70,
	},
	title: {
		fontSize: Sizes.ajustFontSize(25),
		color: Colors.text,
		marginTop: 40,
		marginBottom: 30,
	},
	data: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		columnGap: 10,
		rowGap: 20,
		flexWrap: "wrap",
		paddingBottom: 70,
	},
});

export default Categories;
