import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, FlatList, Pressable, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Link } from "expo-router";

import { Colors, Ads, Sizes, LocalStorage, Constants, Query } from "@/config";
import { AdBanner, Loader, Card_Section, Title, Home_Slider, Home_Dot, Database, useFetch, Error } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const DATA_SIZE_CONTENT: number = 10;

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);
	const [Categories, setCategories] = useState<any>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [appstore, setAppStore] = useState<string>("");

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });

	const scrollX: any = useRef(new Animated.Value(0)).current;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

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
		Database({ setCategories, dispatch });
	}, []);

	useEffect(() => {
		if (Categories.length > 0 && allData.length > 0) setLoading(false);
	}, [Categories, allData]);

	useEffect(() => {
		if (data.hasOwnProperty("movie")) setAllData([...data.movie, ...data.series]);
	}, [isLoading]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (error[0]) return <Error deviceColor={deviceColor} DarkModeType={DarkModeType} />;
	if (isLoading && loading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView
			style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }, CanLoad && { paddingBottom: 70 }]}
		>
			{CanLoad && <AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />}
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ paddingHorizontal: Sizes.paddingHorizontal }}>
					<Title title="Inicio" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				</View>
				<FlatList
					horizontal
					disableVirtualization
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
					data={allData?.sort((a: any, b: any) => b._createdAt?.localeCompare(a._createdAt)).slice(0, DATA_SIZE_CONTENT)}
					keyExtractor={(item) => item.title}
					onScroll={handleOnScroll}
				/>
				{/* <Home_Dot
					data={allData?.sort((a: any, b: any) => b._createdAt?.localeCompare(a._createdAt)).slice(0, DATA_SIZE_CONTENT)}
					scrollX={scrollX}
					deviceColor={deviceColor}
					DarkModeType={DarkModeType}
					PrincipalColor={PrincipalColor}
				/> */}
				{Categories &&
					Categories.sort((a: any, b: any) => a.title.localeCompare(b.title)).map((item: any, i: number) => {
						const content: any = allData
							.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt))
							.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

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
								deviceColor={deviceColor}
								DarkModeType={DarkModeType}
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
