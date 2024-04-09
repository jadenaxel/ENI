import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AdBanner } from "@/components";
import { Ads, Colors } from "@/config";

const Search: FC = (): JSX.Element => {
	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.SEARCH_SCREEN_BANNER_V1} />
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});

export default Search;
