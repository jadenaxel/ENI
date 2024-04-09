import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Ads } from "@/config";
import { AdBanner } from "@/components";

const Home: FC = (): JSX.Element => {
	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.HOME_SCREEN_BANNER_V1} />
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
