import type { FC } from "react";

import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Colors, Ads, Sizes } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card, Title } from "@/components";
import { Query } from "@/config";
import { Actions, Context } from "@/Wrapper";

const DATA_SIZE_CONTENT: number = 10;

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const CARD_SECTION = ({ data, title, dispatch, isLoaded, show }: any) => {
	return (
		<View>
			<Text style={styles.lastSeriesTitle}>{title}</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lastSeriesContent}>
				{data
					.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt))
					.slice(0, DATA_SIZE_CONTENT)
					.map((item: any, i: number) => {
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
			</ScrollView>
		</View>
	);
};

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const { dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });
	const Categories = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.All }).data;

	useEffect(() => {
		if (data.hasOwnProperty("movie")) {
			setAllData([...data.movie, ...data.series]);
			setLoading(false);
		}
	}, [data]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (error[0]) return <Error />;
	if (isLoading || loading) return <Loader />;

	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Title title="Inicio" />
				<CARD_SECTION data={data.series} title={"Ultimas Series"} dispatch={dispatch} isLoaded={isLoaded} show={show} />
				<CARD_SECTION data={data.movie} title={"Ultimas Peliculas"} dispatch={dispatch} isLoaded={isLoaded} show={show} />
				{Categories.sort((a: any, b: any) => a.title.localeCompare(b.title)).map((item: any, i: number) => {
					const content = allData.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

					if (content.length <= 0) return null;

					return (
						<View style={styles.categories} key={i}>
							<CARD_SECTION data={content} title={item.title} dispatch={dispatch} isLoaded={isLoaded} show={show} />
						</View>
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
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 70,
	},
	lastSeriesTitle: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		marginVertical: 20,
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	lastSeriesContent: {
		flexDirection: "row",
		gap: 10,
	},
	categories: {},
});

export default Home;
