import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

import { version } from "@/package.json";
import { Colors, Constants, Sizes } from "@/config";
import { Title } from "@/components";
import { Context } from "@/Wrapper";

const More: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);
	const { colorOne, textColor } = state;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const REPORT_ERROR: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Error"`;

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView>
				<Title title="Ajustes" deviceColor={deviceColor} DarkModeType={DarkModeType} />
				{/* <Link href={"/(more)/profile"} asChild style={styles.profile}>
					<Pressable style={styles.settingList}>
						<Text style={styles.settingListText}>Perfil</Text>
						<Feather name="chevron-right" size={20} color={Colors.text} />
					</Pressable>
				</Link> */}
				<Link href={"/(more)/custom"} asChild>
					<Pressable>
						<View style={[styles.settingList, { borderBottomColor: Constants.ColorType("text", deviceColor, DarkModeType) }]}>
							<Text style={[styles.settingListText, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Personalización</Text>
							<Feather name="chevron-right" size={20} color={Constants.ColorType("text", deviceColor, DarkModeType)} />
						</View>
					</Pressable>
				</Link>
				<View style={{ flexDirection: "row", marginBottom: 20 }}>
					<Text style={{ color: Constants.ColorType("text", deviceColor, DarkModeType) }}>App Version: </Text>
					<Text style={{ color: Constants.ColorType("text", deviceColor, DarkModeType) }}>{version}</Text>
				</View>
				{/* <Pressable style={styles.settingList}>
					<Text style={styles.settingListText}>Apps</Text>
					<Feather name="chevron-right" size={20} color={Colors.text} />
				</Pressable> */}
				<Pressable onPress={() => Linking.openURL("https://t.me/ENIDATA")} style={[styles.button, { backgroundColor: colorOne }]}>
					<Text style={[styles.buttonText, { color: textColor }]}>Unete al nuestro canal</Text>
				</Pressable>
				<Pressable onPress={() => Linking.openURL(REPORT_ERROR)} style={[styles.button, { backgroundColor: colorOne }]}>
					<Text style={[styles.buttonText, { color: textColor }]}>Reportar Error</Text>
				</Pressable>
				{/* Cambiar color de la app */}
				{/* Eliminar anuncios */}
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	button: {
		marginBottom: 10,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	buttonText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
	},
	profile: {
		marginTop: 20,
	},
	settingList: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",

		paddingVertical: 10,
		borderBottomWidth: 1,
		marginBottom: 10,
	},
	settingListText: {
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default More;
