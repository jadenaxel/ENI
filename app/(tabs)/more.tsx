import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, useColorScheme, TouchableHighlight } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as Updates from "expo-updates";

import { Ads, Colors, Constants, Sizes } from "@/config";
import { AdBanner, Loader, Title } from "@/components";
import { Context } from "@/Wrapper";

const More: FC = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { state }: any = useContext(Context);

	const CanLoad: boolean = state.BannerAd === "Load";

	const userColor: string = state.colorOne;
	const textColor: string = state.textColor;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const onFetchUpdateAsync = async () => {
		setIsLoading(true);
		try {
			const update = await Updates.checkForUpdateAsync();
			if (update.isAvailable) {
				await Updates.fetchUpdateAsync();
				await Updates.reloadAsync();
			}
		} catch (error) {
			alert(`Error fetching latest Expo update: ${error}`);
		}
		setIsLoading(false);
	};

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

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
				<TouchableHighlight style={[styles.update, { backgroundColor: userColor }]} onPress={() => onFetchUpdateAsync()}>
					<Text style={[styles.textUpdate, { color: textColor }]}>Buscar Actualizacion</Text>
				</TouchableHighlight>
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
	update: {
		marginVertical: 20,
		backgroundColor: "#0088cc",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	textUpdate: {
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default More;
