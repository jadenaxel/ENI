import type { FC } from "react";

import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ads, Colors, Sizes } from "@/config";
import { AdBanner, Title } from "@/components";

const More: FC = (): JSX.Element => {
	return (
		<SafeAreaView style={styles.main}>
			<AdBanner ID={Ads.MORE_SCREEN_BANNER_V1} />
			<ScrollView>
				<Title title="Ajustes" />
				<View style={styles.tlcontent}>
					<Pressable onPress={() => Linking.openURL("https://t.me/ENIDATA")} style={styles.telegram}>
						<Text style={styles.telegramText}>Unete al nuestro canal</Text>
					</Pressable>
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
		paddingBottom: 70,
	},
	tlcontent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: Sizes.windowHeight / 1.2,
	},
	telegram: {
		backgroundColor: "#0088cc",
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	telegramText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default More;
