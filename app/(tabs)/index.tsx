import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, Pressable, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Link } from "expo-router";
import * as Updates from "expo-updates";

import { Colors, Ads, Sizes, Constants, Query } from "@/config";
import { AdBanner, Loader, Card_Section, Title, Home_Slider, Home_Dot, useFetch, Error } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const DATA_SIZE_CONTENT: number = 10;

let intervalId: any;
let currentScrollX = 0;
let isForward = true;

const onFetchUpdateAsync = async () => {
	try {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	} catch (error) {}
};

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);
	const { store, darkMode, colorOne, BannerAd } = state;

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });
	const Categories = useFetch({ uri: Query.Search.Query, dispatch, dispatchType: Actions.Categories }).data;

	const scrollX: any = useRef(new Animated.Value(0)).current;
	const scrollTo: any = useRef();

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const CanLoad: boolean = BannerAd === "Load";

	const maxScrollX = Sizes.windowWidth * (allData.slice(0, DATA_SIZE_CONTENT).length - 1);

	const handleOnScroll = (event: any) => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })(event);

	const startAutoScroll = () => {
		intervalId = setInterval(() => {
			if (isForward) {
				// Avanzar
				currentScrollX += Sizes.windowWidth;
				if (currentScrollX > maxScrollX) {
					currentScrollX = maxScrollX;
					isForward = false; // Cambia la dirección al final
				}
			} else {
				currentScrollX -= Sizes.windowWidth;
				if (currentScrollX < 0) {
					currentScrollX = 0;
					isForward = true; // Cambia la dirección al inicio
				}
			}
			scrollTo.current?.scrollTo({ x: currentScrollX, y: 0, animated: true });
		}, 5000);
	};

	const handleMomentumScrollEnd = (event: any) => {
		currentScrollX = event.nativeEvent.contentOffset.x;
		isForward = currentScrollX === 0;
		clearInterval(intervalId);
	};

	console.log("first");

	useEffect(() => {
		startAutoScroll();

		return () => {
			clearInterval(intervalId);
		};
	}, [allData]);

	useEffect(() => {
		onFetchUpdateAsync();
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
		<SafeAreaView
			style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }, CanLoad && { paddingBottom: 70 }]}
		>
			{CanLoad && <AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />}
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ paddingHorizontal: Sizes.paddingHorizontal }}>
					<Title title="Inicio" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				</View>
				<ScrollView
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator
					onScroll={handleOnScroll}
					ref={scrollTo}
					onMomentumScrollEnd={(event: any) => handleMomentumScrollEnd(event)}
				>
					{allData
						.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt))
						.slice(0, DATA_SIZE_CONTENT)
						.map((item: any, i: number) => {
							return (
								<Link href={"/(content)/item"} asChild key={i}>
									<Pressable
										onPress={() => {
											dispatch({ type: Actions.SeriesItem, payload: { item } });
											if (isLoaded) show();
										}}
									>
										<Home_Slider item={item} />
									</Pressable>
								</Link>
							);
						})}
				</ScrollView>
				<Home_Dot
					data={allData.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt)).slice(0, DATA_SIZE_CONTENT)}
					scrollX={scrollX}
					deviceColor={deviceColor}
					DarkModeType={DarkModeType}
					PrincipalColor={colorOne}
				/>
				{Categories &&
					Categories.map((item: any, i: number) => {
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
		backgroundColor: Colors.background,
	},
});

export default Home;
