import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, ScrollView, View, Pressable, useColorScheme, FlatList, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useInterstitialAd } from "react-native-google-mobile-ads";
import { Link } from "expo-router";

import { Ads, Sizes, Constants, Query } from "@/config";
import { Loader, Title, Home_Slider, Home_Dot, useFetch, Error, Card, Top } from "@/components";
import { Actions, Context } from "@/Wrapper";

const AD_STRING: string = Ads.SERIES_LAST_HOME_INTERSTITIAL_V1;

const DATA_SIZE_CONTENT: number = 10;

let intervalId: any;
let currentScrollX = 0;
let isForward = true;

const Home: FC = (): JSX.Element => {
	const [allData, setAllData] = useState<any>([]);

	const { state, dispatch }: any = useContext(Context);

	const { isLoaded, isClosed, load, show }: any = useInterstitialAd(AD_STRING);
	const { darkMode, colorOne } = state;

	const { data, isLoading, error }: any = useFetch({ uri: Query.Home.Query, dispatch, dispatchType: Actions.All });

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
									dispatch({ type: Actions.SeriesItem, payload: { item: item.item._id } });
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
				<Top title="Top 10 Series" type="series" data={allData} isLoaded={isLoaded} show={show} deviceColor={deviceColor} DarkModeType={DarkModeType} />
				<Top
					title="Top 10 Peliculas"
					type="movies"
					data={allData}
					isLoaded={isLoaded}
					show={show}
					deviceColor={deviceColor}
					DarkModeType={DarkModeType}
				/>
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Lo Ultimo</Text>
					<View style={styles.cardBody}>
						{allData.slice(0, 15).map((item: any, i: any) => {
							return (
								<Link href={"/(content)/item"} asChild key={i}>
									<Pressable
										onPress={() => {
											dispatch({ type: Actions.SeriesItem, payload: { item: item._id } });
											if (isLoaded) show();
										}}
									>
										<Card item={item} deviceColor={deviceColor} DarkModeType={DarkModeType} />
									</Pressable>
								</Link>
							);
						})}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingBottom: 20,
	},
	card: {
		paddingHorizontal: Sizes.paddingHorizontal,
		marginTop: 30,
	},
	cardTitle: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 30,
	},
	cardBody: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 10,
	},
});

export default Home;
