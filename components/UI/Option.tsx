import type { FC } from "react";

import { useEffect, useState } from "react";
import { Text, StyleSheet, Pressable, Linking, Alert, Image, View } from "react-native";

import { Ads, Colors, Sizes, Url } from "@/config";
import { Feather } from "@expo/vector-icons";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import Loader from "./Loader";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.DOWNLOAD_SCREEN_INTERSTITIAL_V1;

const Item: FC<any> = ({ item, handleDownload }: any): JSX.Element => {
	const typeOfLink = item.hasOwnProperty("link") ? item.link : item;
	const siteName: string = typeOfLink.includes("magnet") ? "Magnet" : typeOfLink.split("/")[2];

	return (
		<Pressable onPress={() => handleDownload(item, item.index)} style={[styles.option, { backgroundColor: Url[siteName]?.color ?? Colors.Tint }]}>
			<Text style={[styles.optionText, { color: Url[siteName]?.text ?? Colors.text }]}>{Url[siteName]?.title ?? siteName}</Text>
			<Feather name="download" size={15} color={Url[siteName]?.text ?? Colors.text} />
			{item.lang &&
				item.lang?.map((langs: any, i: number) => {
					return <Image source={{ uri: langs.asset.url }} key={i} style={styles.flags} />;
				})}
		</Pressable>
	);
};

const Option: FC<any> = ({ data, deviceColor, DarkModeType }: any): JSX.Element => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const OpenLink = async (link: string) => {
		if (await Linking.canOpenURL(link)) Linking.openURL(link);
		else Alert.alert("Lo siento. Tienes que tener un cliente torrent para abrir este link.");
		setIsLoading(false);
	};

	const handleDownload = (item: any, i: number) => {
		setIsLoading(true);
		if (i === 0) OpenLink(item);
		if (isLoaded && i !== 0) {
			show();
			OpenLink(item);
		}
	};

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<View style={styles.optionContainer}>
			{data.map((item: any, i: number) => (
				<Item key={i} item={item} handleDownload={handleDownload} />
			))}
		</View>
	);
};
const styles = StyleSheet.create({
	optionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginBottom: 10,
	},
	option: {
		padding: 15,
		borderRadius: 4,

		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		flexWrap: "wrap",

		gap: 5,

		width: "100%",
	},
	optionText: {
		textTransform: "capitalize",
		fontSize: Sizes.ajustFontSize(15),
	},
	flags: {
		width: 20,
		height: 20,
	},
});

export default Option;
