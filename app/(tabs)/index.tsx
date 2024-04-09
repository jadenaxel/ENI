import type { FC } from "react";

import { View, Text, StyleSheet, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Ads, Sizes } from "@/config";
import { AdBanner, Loader, useFetch, Error, Card } from "@/components";
import { Query } from "@/config";

const LAST_SERIES_SIZE: number = 15;

const Home: FC = (): JSX.Element => {
	const { data, isLoading, error } = useFetch({ uri: Query.Home.Query });

	if (error[0]) return <Error />;
	if (isLoading) return <Loader />;

	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					<Text style={styles.lastSeriesTitle}>Ultimas Series</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lastSeriesContent}>
						{data.slice(0, LAST_SERIES_SIZE).map((item: any, i: number) => {
							return <Card item={item} key={i} />;
						})}
					</ScrollView>
				</View>
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
		fontSize: Sizes.windowWidth / 16,
		marginVertical: 20,
		textTransform: "uppercase",
	},
	lastSeriesContent: {
		flexDirection: "row",
		gap: 10,
	},
});

export default Home;
