import type { FC } from "react";

import { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import { Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import { AdBanner, Option } from "@/components";
import { Ads, Colors, Constants, Sizes, Url } from "@/config";
import { Context } from "@/Wrapper";

const Chapter: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const { Links } = state;
	const { note, title, link, watch } = Links.item;

	const [watchOption, setWatchOption] = useState<string>(watch ? watch[0] : "");

	const PrincipalColor: string = state.colorOne;
	const TextColor: string = state.textColor;

	const CanLoad: boolean = state.BannerAd === "Load";

	const contentTitle = Links.contentTitle;

	const REPORT_SERIES: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Serie"&body="La Serei ${contentTitle} tiene problema. En el capitulo ${title}"`;

	return (
		<View style={[styles.main, CanLoad && !Constants.IsDev && { paddingBottom: 70 }]}>
			{!Constants.IsDev && <AdBanner ID={Ads.OPTION_SCREEN_BANNER_V1} />}
			<Text style={styles.chapter}>{title}</Text>
			{watchOption.length > 0 && (
				<View>
					<View style={styles.webVideo}>
						<WebView source={{ uri: watchOption }} allowsFullscreenVideo cacheEnabled contentMode="mobile" />
					</View>
					<View style={styles.options}>
						{watch &&
							watch.map((wa: any, i: number) => {
								const siteName: string = wa.split("/")[2];
								return (
									<Pressable
										onPress={() => setWatchOption(wa)}
										key={i}
										style={[styles.optionWatch, { backgroundColor: Url[siteName]?.color ?? Colors.Tint }]}
									>
										<Text style={styles.optionWatchText}>{Url[siteName]?.title ?? siteName}</Text>
									</Pressable>
								);
							})}
					</View>
				</View>
			)}
			{note && (
				<View style={styles.noteContainer}>
					<Text style={styles.noteTitle}>Nota</Text>
					<Text style={styles.noteContent}>{note}</Text>
				</View>
			)}
			<View>
				<Text style={styles.downloads}>Descargas</Text>
				<Option data={link} />
			</View>
			<Pressable onPress={() => Linking.openURL(REPORT_SERIES)} style={[styles.seriesButton, { backgroundColor: PrincipalColor }]}>
				<Feather name="mail" size={20} color={TextColor} />
				<Text style={[styles.seriesButtonText, { color: TextColor }]}>Reportar</Text>
			</Pressable>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingTop: 50,
	},
	chapter: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(25),
		marginBottom: 20,
	},
	webVideo: {
		height: Sizes.windowHeight / 5,
		marginBottom: 10,
		backgroundColor: "red",
	},
	options: {
		gap: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 20,
	},
	optionWatch: {
		padding: 10,
		borderRadius: 4,
	},
	optionWatchText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
	},
	noteContainer: {
		backgroundColor: Colors.black,
		borderRadius: 4,
		padding: 20,
		marginBottom: 20,
	},
	noteTitle: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		marginBottom: 20,
	},
	noteContent: {
		fontSize: Sizes.ajustFontSize(15),
		color: Colors.text,
	},
	downloads: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		marginBottom: 20,
	},
	seriesButton: {
		borderRadius: 4,
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	seriesButtonText: {
		marginLeft: 10,
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Chapter;
