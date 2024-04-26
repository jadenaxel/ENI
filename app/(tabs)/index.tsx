import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, Pressable, useColorScheme, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Link } from "expo-router";
import * as Updates from "expo-updates";

import { Ads, Sizes, Constants, Query } from "@/config";
import { Loader, Card_Section, Title, Home_Slider, Home_Dot, useFetch, Error } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const DATA_SIZE_CONTENT: number = 10;

let intervalId: any;
let currentScrollX = 0;
let isForward = true;

const onFetchUpdateAsync = async (store: string) => {
	try {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable && store === "123show") {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	} catch (error) {}
};

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);
	const { store, darkMode, colorOne } = state;

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });
	const Categories = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.Categories, load: false, errors: false }).data;

	const scrollX: any = useRef(new Animated.Value(0)).current;
	const scrollTo: any = useRef();

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const maxScrollX: number = allData.slice(0, DATA_SIZE_CONTENT).length - 1;

	const handleOnScroll = (event: any) => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })(event);

	const startAutoScroll = () => {
		intervalId = setInterval(() => {
			if (isForward) {
				currentScrollX += 1;
				if (currentScrollX > maxScrollX) {
					currentScrollX = maxScrollX;
					isForward = false;
				}
			} else {
				currentScrollX -= maxScrollX;
				if (currentScrollX < 0) {
					currentScrollX = 0;
					isForward = true;
				}
			}
			scrollTo.current?.scrollToIndex({
				index: currentScrollX,
				animated: true,
			});
		}, 5000);
	};

	const handleMomentumScrollEnd = (): any => {
		isForward = currentScrollX === 0;
		clearInterval(intervalId);
		startAutoScroll();
	};

	useEffect(() => {
		startAutoScroll();

		return () => {
			clearInterval(intervalId);
		};
	}, [allData]);

	useEffect(() => {
		onFetchUpdateAsync(store);
	}, []);

	useEffect(() => {
		if (data.hasOwnProperty("movie")) setAllData([...data.movie, ...data.series]);
	}, [isLoading]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (error[0]) return <Error deviceColor={deviceColor} DarkModeType={DarkModeType} />;
	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ paddingHorizontal: Sizes.paddingHorizontal }}>
					<Title title="Inicio" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				</View>
				<FlatList
					horizontal
					pagingEnabled
					onScrollToIndexFailed={() => console.log("IDGAF")}
					showsHorizontalScrollIndicator={false}
					onScroll={handleOnScroll}
					ref={scrollTo}
					onMomentumScrollEnd={handleMomentumScrollEnd}
					initialNumToRender={3}
					maxToRenderPerBatch={7}
					windowSize={2}
					removeClippedSubviews
					data={allData.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt)).slice(0, DATA_SIZE_CONTENT)}
					updateCellsBatchingPeriod={50}
					keyExtractor={(item: any) => item._id}
					renderItem={(item: any) => (
						<Link href={"/(content)/item"} asChild>
							<Pressable
								onPress={() => {
									dispatch({ type: Actions.SeriesItem, payload: { item: item.item } });
									if (isLoaded) show();
								}}
							>
								<Home_Slider item={item.item} />
							</Pressable>
						</Link>
					)}
				/>
				<Home_Dot
					data={allData.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt)).slice(0, DATA_SIZE_CONTENT)}
					scrollX={scrollX}
					deviceColor={deviceColor}
					DarkModeType={DarkModeType}
					PrincipalColor={colorOne}
				/>
				{Categories.slice(0, 5)
					.filter((item) => allData.some((data: any) => data.categories.some((ca: any) => ca.title === item.title)))
					.map((item, i) => {
						const content = allData.filter((data: any) => data.categories.some((ca: any) => ca.title === item.title));

						return (
							<Card_Section
								key={i}
								data={content}
								title={item.title}
								dispatch={dispatch}
								isLoaded={isLoaded}
								show={show}
								appstore={store}
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
		paddingBottom: 20,
	},
});

export default Home;
