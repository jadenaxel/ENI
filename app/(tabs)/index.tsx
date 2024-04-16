import type { FC } from "react";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, FlatList, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Link } from "expo-router";

import { Colors, Ads, Sizes, LocalStorage, Query } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card_Section, Title, Home_Slider, Home_Dot } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;
const DATA_SIZE_CONTENT: number = 10;

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [appstore, setAppStore] = useState<string>("");

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });
	const Categories: any = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.All }).data;

	const scrollX: any = useRef(new Animated.Value(0)).current;

	const PrincipalColor: string = state.colorOne;
	const CanLoad: boolean = state.BannerAd === "Load";

	const getLocalData = async (): Promise<void> => {
		const LocalData = await LocalStorage.getData("appstore");
		const realData = LocalData.length > 0 ? LocalData[0] : state.store;
		setAppStore(realData);
	};

	const handleOnScroll = (event: any) => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })(event);

	useEffect(() => {
		getLocalData();
	}, []);

	useEffect(() => {
		if (data.hasOwnProperty("movie")) {
			setAllData([...data.movie, ...data.series]);
			setLoading(false);
		}
	}, [isLoading]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (error[0]) return <Error />;
	if (isLoading && loading) return <Loader />;

	return (
		<SafeAreaView style={[styles.main, CanLoad && { paddingBottom: 70 }]}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ paddingHorizontal: Sizes.paddingHorizontal }}>
					<Title title="Inicio" />
				</View>
				<FlatList
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					snapToAlignment="center"
					renderItem={({ item }) => (
						<Link href={"/(content)/item"} asChild>
							<Pressable
								onPress={() => {
									dispatch({ type: Actions.SeriesItem, payload: { item, appstore } });
									if (isLoaded) show();
								}}
							>
								<Home_Slider item={item} />
							</Pressable>
						</Link>
					)}
					data={allData.slice(0, 10)}
					keyExtractor={(e) => e.title}
					onScroll={handleOnScroll}
				/>
				<Home_Dot data={allData.slice(0, DATA_SIZE_CONTENT)} scrollX={scrollX} PrincipalColor={PrincipalColor} />
				{Categories.sort((a: any, b: any) => a.title.localeCompare(b.title)).map((item: any, i: number) => {
					const content: any = allData.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

					if (content.length <= 0) return null;

					return (
						<Card_Section
							key={i}
							data={content}
							title={item.title}
							dispatch={dispatch}
							isLoaded={isLoaded}
							show={show}
							appstore={appstore}
							DATA_SIZE_CONTENT={DATA_SIZE_CONTENT}
						/>
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
	},
});

export default Home;
