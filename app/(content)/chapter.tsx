import type { FC } from "react";

import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import { Feather } from "@expo/vector-icons";

import { AdBanner, Option } from "@/components";
import { Ads, Colors, Sizes } from "@/config";
import { Context } from "@/Wrapper";

const Chapter: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const PrincipalColor: string = state.colorOne;
	const TextColor: string = state.textColor;

	const { Links } = state;

	const { note, title, link } = Links.chapter;
	const contentTitle = Links.contentTitle;

	const REPORT_SERIES: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Serie"&body="La Serei ${contentTitle} tiene problema. En el capitulo ${title}"`;

	return (
		<View style={styles.main}>
			<AdBanner ID={Ads.OPTION_SCREEN_BANNER_V1} />
			<Text style={styles.chapter}>Capitulo - {title.split("x")[0]}</Text>
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
