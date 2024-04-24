import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

import { version } from "@/package.json";
import { Ads, Colors, Constants, Sizes } from "@/config";
import { AdBanner, Title } from "@/components";
import { Context } from "@/Wrapper";

const More: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const CanLoad: boolean = state.BannerAd === "Load";

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	return (
		<SafeAreaView
			style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }, CanLoad && { paddingBottom: 70 }]}
		>
			{CanLoad && <AdBanner ID={Ads.MORE_SCREEN_BANNER_V1} />}
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
				{/* <Pressable style={styles.settingList}>
					<Text style={styles.settingListText}>Apps</Text>
					<Feather name="chevron-right" size={20} color={Colors.text} />
				</Pressable> */}
				<Pressable onPress={() => Linking.openURL("https://t.me/ENIDATA")} style={styles.telegram}>
					<Text style={styles.telegramText}>Unete al nuestro canal</Text>
				</Pressable>
				{/* Cambiar color de la app */}
				{/* Eliminar anuncios */}
				<View style={{ flexDirection: "row" }}>
					<Text style={{ color: Constants.ColorType("text", deviceColor, DarkModeType) }}>App Version: </Text>
					<Text style={{ color: Constants.ColorType("text", deviceColor, DarkModeType) }}>{version}</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	telegram: {
		marginVertical: 20,
		backgroundColor: "#0088cc",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	telegramText: {
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
	},
	settingListText: {
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default More;
