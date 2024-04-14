import type { FC } from "react";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";

import { Ads, Colors, Sizes, Url } from "@/config";
import { Feather } from "@expo/vector-icons";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import Loader from "./Loader";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.DOWNLOAD_SCREEN_INTERSTITIAL_V1;

const Option: FC<any> = ({ data }: any): JSX.Element => {
	const [toGo, setToGo] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const OpenLink = async (link: string) => {
		if (await Linking.canOpenURL(link)) {
			Linking.openURL(link);
		} else Alert.alert("Lo siento. Tienes que tener un cliente torrent para abrir este link.");
		setIsLoading(false);
	};

	const handleDownload = (item: any, i: number) => {
		setIsLoading(true);
		if (i === 0) OpenLink(item);
		if (isLoaded && i !== 0) {
			show();
			setToGo(item);
		}
	};

	useEffect(() => {
		if (isClosed) OpenLink(toGo);
	}, [toGo, isClosed]);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader />;

	return (
		<View style={styles.optionContainer}>
			{data.map((item: any, i: number) => {
				const siteName: string = item.includes("magnet") ? "Magnet" : item.split("/")[2];

				return (
					<Pressable
						onPress={() => handleDownload(item, i)}
						key={i}
						style={[styles.option, { backgroundColor: Url[siteName]?.color ?? Colors.Tint }]}
					>
						<Text style={[styles.optionText, { color: Url[siteName]?.text ?? Colors.text }]}>{Url[siteName]?.title ?? siteName}</Text>
						<Feather name="download" size={15} color={Url[siteName]?.text ?? Colors.text} />
					</Pressable>
				);
			})}
		</View>
	);
};
const styles = StyleSheet.create({
	optionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	option: {
		padding: 15,
		borderRadius: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		gap: 10,
		width: "100%",
	},
	optionText: {
		textTransform: "capitalize",
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Option;
