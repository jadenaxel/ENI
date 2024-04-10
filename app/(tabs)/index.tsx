import type { FC } from "react";

import { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Colors, Ads, Sizes } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card } from "@/components";
import { Query } from "@/config";
import { Actions, Context } from "@/Wrapper";

const LAST_SERIES_SIZE: number = 10;

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const CARD_SECTION = ({ data, title, dispatch, isLoaded, show }: any) => {
	return (
		<View>
			<Text style={styles.lastSeriesTitle}>{title}</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lastSeriesContent}>
				{data.slice(0, LAST_SERIES_SIZE).map((item: any, i: number) => {
					return (
						<Link key={i} href={"/(series)/item"} asChild>
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
			</ScrollView>
		</View>
	);
};

const Home: FC = (): JSX.Element => {
	const { dispatch }: any = useContext(Context);
	const { isLoaded, load, show } = useInterstitialAd(AD_STRING);
	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });

	useEffect(() => {
		load();
	}, [load]);

	if (error[0]) return <Error />;
	if (isLoading) return <Loader />;

	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<CARD_SECTION data={data.series} title={"Ultimas Series"} dispatch={dispatch} isLoaded={isLoaded} show={show} />
				<CARD_SECTION data={data.movie} title={"Ultimas Peliculas"} dispatch={dispatch} isLoaded={isLoaded} show={show} />
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
	lastSeriesTitle: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(20),
		marginVertical: 20,
		textTransform: "uppercase",
	},
	lastSeriesContent: {
		flexDirection: "row",
		gap: 10,
	},
});

export default Home;
