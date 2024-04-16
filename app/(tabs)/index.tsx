import type { FC } from "react";

import { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

import { Colors, Ads, Sizes, LocalStorage, Query } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card_Section, Title } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [appstore, setAppStore] = useState<string>("");

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });
	const Categories = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.All }).data;

	const CanLoad: boolean = state.BannerAd === "Load";

	const getLocalData = async () => {
		const LocalData = await LocalStorage.getData("appstore");
		const realData = LocalData.length > 0 ? LocalData[0] : state.store;
		setAppStore(realData);
	};

	useEffect(() => {
		getLocalData();
	}, []);

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
		<SafeAreaView style={[styles.main, CanLoad ? { paddingBottom: 70 } : null]}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Title title="Inicio" />
				<Card_Section data={data.series} title={"Ultimas Series"} dispatch={dispatch} isLoaded={isLoaded} show={show} appstore={appstore} />
				<Card_Section data={data.movie} title={"Ultimas Peliculas"} dispatch={dispatch} isLoaded={isLoaded} show={show} appstore={appstore} />
				{Categories.sort((a: any, b: any) => a.title.localeCompare(b.title)).map((item: any, i: number) => {
					const content: any = allData.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

					if (content.length <= 0) return null;

					return <Card_Section key={i} data={content} title={item.title} dispatch={dispatch} isLoaded={isLoaded} show={show} appstore={appstore} />;
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
	},
});

export default Home;
