import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { Fragment, useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking, useColorScheme, Image } from "react-native";

import { Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import { Option } from "@/components";
import { Colors, Constants, Sizes, Url } from "@/config";
import { Context } from "@/Wrapper";

const Chapter: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const { Links, colorOne, textColor, darkMode } = state;
	const { note, title, links, watches } = Links.item;

	const [watchOption, setWatchOption] = useState<string>(watches ? watches[0]?.link : "");

	const deviceColor: ColorSchemeName = useColorScheme();

	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const contentTitle = Links.contentTitle;

	const REPORT_SERIES: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Serie"&body="La Serei ${contentTitle} tiene problema. En el capitulo ${title}"`;

	return (
		<View style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<Text style={[styles.chapter, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{title}</Text>
			{watchOption.length > 0 && (
				<Fragment>
					<View style={styles.webVideo}>
						<WebView source={{ uri: watchOption }} allowsFullscreenVideo cacheEnabled contentMode="mobile" />
					</View>
					<View style={styles.options}>
						{watches.map((wa: any, i: number) => {
							const siteName: string = wa.link.split("/")[2];

							return (
								<Pressable
									onPress={() => setWatchOption(wa.link)}
									key={i}
									style={[styles.optionWatch, { backgroundColor: Url[siteName]?.color ?? Colors.Tint }]}
								>
									<Text style={styles.optionWatchText}>{Url[siteName]?.title ?? siteName}</Text>
									{wa?.lang &&
										wa.lang.map((langs: any, i: number) => {
											return <Image source={{ uri: langs.asset.url }} key={i} style={styles.flags} />;
										})}
								</Pressable>
							);
						})}
					</View>
				</Fragment>
			)}
			<View style={{ marginHorizontal: Sizes.paddingHorizontal }}>
				<Text style={[styles.downloads, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Descargas</Text>
				{links && <Option data={links} deviceColor={deviceColor} DarkModeType={DarkModeType} />}
			</View>
			<Pressable onPress={() => Linking.openURL(REPORT_SERIES)} style={[styles.seriesButton, { backgroundColor: colorOne }]}>
				<Feather name="mail" size={20} color={textColor} />
				<Text style={[styles.seriesButtonText, { color: textColor }]}>Reportar</Text>
			</Pressable>

			{note && (
				<View style={styles.noteContainer}>
					<Text style={[styles.noteTitle]}>Nota</Text>
					<Text style={styles.noteContent}>{note}</Text>
				</View>
			)}
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,

		paddingTop: 50,
	},
	chapter: {
		fontSize: Sizes.ajustFontSize(25),
		marginBottom: 20,
		textAlign: "center",
	},
	webVideo: {
		height: Sizes.windowHeight / 4,
		marginBottom: 10,
		backgroundColor: "red",
	},
	options: {
		gap: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 20,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	optionWatch: {
		padding: 10,
		borderRadius: 4,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		justifyContent: "center",
	},
	optionWatchText: {
		fontSize: Sizes.ajustFontSize(15),
	},
	flags: {
		width: 20,
		height: 20,
	},

	langs: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 5,
	},
	langsFlag: {
		flexDirection: "row",
		gap: 10,
	},
	noteContainer: {
		paddingHorizontal: Sizes.paddingHorizontal,
		borderRadius: 4,
		padding: 20,
		marginBottom: 20,
	},
	noteTitle: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 20,
	},
	noteContent: {
		fontSize: Sizes.ajustFontSize(15),
	},
	downloads: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 20,
	},
	seriesButton: {
		borderRadius: 4,
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		marginHorizontal: Sizes.paddingHorizontal,
	},
	seriesButtonText: {
		marginLeft: 10,
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Chapter;
