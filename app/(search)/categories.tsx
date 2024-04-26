import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme, SafeAreaView } from "react-native";

import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Colors, Constants, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Card } from "@/components";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Categories: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { state, dispatch }: any = useContext(Context);
	const { darkMode, Categories, Data } = state;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const { series, movie } = Data;

	const loadCategories = () => {
		const SeriesFiler = series.filter((item: any) =>
			item.categories.some((category: any) => category.title.toLowerCase() === Categories.title.toLowerCase())
		);
		const MovieFiler = movie.filter((item: any) =>
			item.categories.some((category: any) => category.title.toLowerCase() === Categories.title.toLowerCase())
		);

		setAllData([...SeriesFiler, ...MovieFiler]);
	};

	useEffect(() => {
		load();
	}, [load, isClosed]);

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={[styles.title, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{Categories.title}</Text>
				<View style={styles.data}>
					{allData
						.sort((a: any, b: any) => a.title.localeCompare(b.title))
						.map((item: any, i: number) => {
							return (
								<Link key={i} href={"/(content)/item"} asChild>
									<Pressable
										onPress={() => {
											dispatch({ type: Actions.SeriesItem, payload: { item } });
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
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
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
