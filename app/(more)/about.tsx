import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useState } from "react";
import { View, Text, StyleSheet, useColorScheme, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Context } from "@/Wrapper";
import { version } from "@/package.json";
import { Constants, Sizes } from "@/config";

const About: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const { darkMode } = state;
	const deviceColor: ColorSchemeName = useColorScheme();

	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;
	const [deviceColorState, _] = useState<string | ColorSchemeName>(DarkModeType);

	const Color = (type: string) => Constants.ColorType(type, deviceColor, deviceColorState);
	const TextColor = { color: Color("text") };

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={[styles.title, TextColor]}>Sobre</Text>
				<View style={styles.container}>
					<View style={styles.appVersion}>
						<Text style={[styles.appText, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Version de la app: </Text>
						<Text style={[styles.appText, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{version}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
	},
	title: {
		marginTop: 10,
		marginBottom: 20,
		fontSize: Sizes.ajustFontSize(25),
		textAlign: "center",
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		height: Sizes.windowHeight / 1.3,
	},
	appVersion: {
		flexDirection: "row",
		marginBottom: 20,
	},
	appVersionActual: {
		flexDirection: "row",
		marginBottom: 20,
	},
	appText: {
		fontSize: Sizes.ajustFontSize(17),
	},
});

export default About;
