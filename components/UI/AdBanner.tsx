import type { FC } from "react";

import { View, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

import { Sizes } from "@/config";

const AdBanner: FC<any> = ({ ID }: { ID: string }): JSX.Element => {
	const AD: string = __DEV__ ? TestIds.ADAPTIVE_BANNER : ID;

	return (
		<View style={styles.bannerAd}>
			<BannerAd unitId={AD} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
		</View>
	);
};
const styles = StyleSheet.create({
	bannerAd: {
		position: "absolute",
		zIndex: 1,
		bottom: 0,
		width: Sizes.windowWidth,
	},
});

export default AdBanner;
