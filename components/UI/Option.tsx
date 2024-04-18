import type { FC } from "react";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking, Alert, FlatList } from "react-native";

import { Ads, Colors, Sizes, Url } from "@/config";
import { Feather } from "@expo/vector-icons";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import Loader from "./Loader";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.DOWNLOAD_SCREEN_INTERSTITIAL_V1;

const Item: FC<any> = ({ item, handleDownload }: any): JSX.Element => {
	const siteName: string = item.item.includes("magnet") ? "Magnet" : item.item.split("/")[2];

	return (
		<Pressable onPress={() => handleDownload(item.item, item.index)} style={[styles.option, { backgroundColor: Url[siteName]?.color ?? Colors.Tint }]}>
			<Text style={[styles.optionText, { color: Url[siteName]?.text ?? Colors.text }]}>{Url[siteName]?.title ?? siteName}</Text>
			<Feather name="download" size={15} color={Url[siteName]?.text ?? Colors.text} />
		</Pressable>
	);
};

const Option: FC<any> = ({ data }: any): JSX.Element => {
	const [toGo, setToGo] = useState<string>("");
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
		<FlatList
			disableVirtualization={true}
			data={data}
			numColumns={2}
			renderItem={(item: any) => <Item item={item} handleDownload={handleDownload} />}
			keyExtractor={(item: any) => item}
			columnWrapperStyle={styles.optionFlat}
		/>
	);
};
const styles = StyleSheet.create({
	optionFlat: {
		gap: 10,
	},
	option: {
		padding: 15,
		borderRadius: 4,
		marginBottom: 10,

		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",

		gap: 5,

		flex: 1,
	},
	optionText: {
		textTransform: "capitalize",
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Option;
