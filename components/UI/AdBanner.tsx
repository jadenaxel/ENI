import type { FC } from "react";

import { useContext } from "react";
import { View, StyleSheet } from "react-native";

import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

import { Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";

const AdBanner: FC<any> = ({ ID }: { ID: string }): JSX.Element => {
	const { dispatch }: any = useContext(Context);

	const AD: string = __DEV__ ? TestIds.ADAPTIVE_BANNER : ID;

	const CantLoad = () => dispatch({ type: Actions.BannerAd, payload: "Can't Load" });

	return (
		<View style={styles.bannerAd}>
			<BannerAd unitId={AD} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} onAdFailedToLoad={CantLoad} />
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
