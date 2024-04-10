import type { FC } from "react";

import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Ads, Colors, Constants, LocalStorage, Sizes } from "@/config";
import { AdBanner, Card, Title } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.FAVORITE_SCREEN_INTERSTITIAL_V1;

const More: FC = (): JSX.Element => {
	const { dispatch }: any = useContext(Context);
	const [allData, setAllData] = useState<any>([]);
	const { isLoaded, load, show } = useInterstitialAd(AD_STRING);

	const getStorageData = async (): Promise<void> => {
		const storageDataSeries = await LocalStorage.getData(Constants.SERIES);
		const storageDataMovies = await LocalStorage.getData(Constants.MOVIES);

		setAllData([...storageDataMovies, ...storageDataSeries]);
	};

	useEffect(() => {
		load();
	}, [load]);

	useEffect(() => {
		getStorageData();
	}, []);

	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.FAVORITE_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Title title="Favoritas" />
				<View style={styles.card}>
					{allData.map((item: any, i: number) => {
						return (
							<Link key={i} href={"/(series)/item"} asChild>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.SeriesItem, payload: item });
										if (isLoaded) show();
									}}
								>
									<Card item={item} key={i} />
								</Pressable>
							</Link>
						);
					})}
				</View>
				{allData.length <= 0 && (
					<View style={styles.favorite}>
						<Text style={styles.favoriteText}>No hay favoritos.</Text>
					</View>
				)}
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
	card: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginTop: 20,
	},
	favorite: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	favoriteText: {
		color: Colors.text,
	},
});

export default More;
