import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useFocusEffect } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Constants, LocalStorage, Query, Sizes } from "@/config";
import { Card, Loader, Title, useFetch } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.FAVORITE_SCREEN_INTERSTITIAL_V1;

const More: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);
	const [loading, setLoading] = useState<boolean>(true);
	const [allData, setAllData] = useState<any>([]);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);
	const { darkMode, Data } = state;

	const data = Data.length > 0 ? Data : useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All }).data;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const { series, movie }: any = data;

	const getStorageData = async (): Promise<void> => {
		const storageDataSeries = await LocalStorage.getData(Constants.SERIES);
		const storageDataMovies = await LocalStorage.getData(Constants.MOVIES);

		const Series: any = series?.filter((item: any) => storageDataSeries.some((series: any) => series._id === item._id));
		const Movie: any = movie?.filter((item: any) => storageDataMovies.some((movie: any) => movie._id === item._id));

		try {
			setAllData([...Series, ...Movie]);
		} catch (e: any) {}
	};

	useEffect(() => {
		load();
	}, [load, isClosed]);

	useEffect(() => {
		if (data.length > 0 || data.hasOwnProperty("movie")) setLoading(false);
	}, [data]);

	useFocusEffect(
		useCallback(() => {
			getStorageData();
		}, [data])
	);

	if (loading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Title title="Favoritas" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				<View style={styles.card}>
					{allData.map((item: any, i: number) => {
						return (
							<Link key={i} href={"/(content)/item"} asChild>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.SeriesItem, payload: { item } });
										if (isLoaded) show();
									}}
								>
									<Card deviceColor={deviceColor} DarkModeType={DarkModeType} item={item} key={i} />
								</Pressable>
							</Link>
						);
					})}
				</View>
			</ScrollView>
			{allData.length <= 0 && (
				<View style={styles.favorite}>
					<Text style={[styles.favoriteText, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>No hay favoritos.</Text>
				</View>
			)}
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	card: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginTop: 20,
	},
	favorite: {
		alignItems: "center",
		flex: 1,
	},
	favoriteText: {
		fontSize: Sizes.ajustFontSize(17),
	},
});

export default More;
