import type { FC } from "react";

import { useContext, useState, useEffect } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Colors, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Card } from "@/components";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Categories: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);

	const { isLoaded, load, show } = useInterstitialAd(AD_STRING);

	const { state, dispatch }: any = useContext(Context);

	const categories = state.Categories;
	const { series, movie } = state.Data;

	const loadCategories = () => {
		const SeriesFiler = series.filter((item: any) => item.categories.some((category: any) => category.title.toLowerCase() === categories.title.toLowerCase()));
		const MovieFiler = movie.filter((item: any) => item.categories.some((category: any) => category.title.toLowerCase() === categories.title.toLowerCase()));

		setAllData([...SeriesFiler, ...MovieFiler]);
	};

	useEffect(() => {
		load();
	}, [load]);

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<View style={styles.main}>
			<Text style={styles.title}>{categories.title}</Text>
			<View style={styles.data}>
				{allData.map((item: any, i: number) => {
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
		</View>
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
		gap: 10,
		flexWrap: "wrap",
	},
});

export default Categories;
