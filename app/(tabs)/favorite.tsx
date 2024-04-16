import type { FC } from "react";

import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useFocusEffect } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Colors, Constants, LocalStorage, Query, Sizes } from "@/config";
import { AdBanner, Card, Loader, Title, useFetch } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.FAVORITE_SCREEN_INTERSTITIAL_V1;

const More: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);
	const [loading, setLoading] = useState<boolean>(true);
	const [allData, setAllData] = useState<any>([]);
	const [appstore, setAppStore] = useState<string>("");

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const data = state.Data.length > 0 ? state.Data : useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All }).data;

	const CanLoad: boolean = state.BannerAd === "Load";

	const { series, movie }: any = data;

	const getStorageData = async (): Promise<void> => {
		const storageDataSeries = await LocalStorage.getData(Constants.SERIES);
		const storageDataMovies = await LocalStorage.getData(Constants.MOVIES);

		const Series: any = series?.filter((item: any) => storageDataSeries.some((series: any) => series.title === item.title));
		const Movie: any = movie?.filter((item: any) => storageDataMovies.some((movie: any) => movie.title === item.title));

		try {
			setAllData([...Series, ...Movie]);
		} catch (e: any) {}
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
		if (data.length > 0 || data.hasOwnProperty("movie")) setLoading(false);
	}, [data]);

	useFocusEffect(
		useCallback(() => {
			getStorageData();
		}, [data])
	);

	if (loading) return <Loader />;

	return (
		<SafeAreaView style={[styles.main, CanLoad ? { paddingBottom: 70 } : null]}>
			<AdBanner ID={Ads.FAVORITE_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Title title="Favoritas" />
				<View style={styles.card}>
					{allData.map((item: any, i: number) => {
						return (
							<Link key={i} href={"/(content)/item"} asChild>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.SeriesItem, payload: { item, appstore } });
										if (isLoaded) show();
									}}
								>
									<Card item={item} key={i} />
								</Pressable>
							</Link>
						);
					})}
				</View>
			</ScrollView>
			{allData.length <= 0 && (
				<View style={styles.favorite}>
					<Text style={styles.favoriteText}>No hay favoritos.</Text>
				</View>
			)}
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
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
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(17),
	},
});

export default More;
