import type { FC } from "react";

import { useContext } from "react";
import { Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

import { Ads, Colors, Sizes } from "@/config";
import { AdBanner, Title } from "@/components";
import { Context } from "@/Wrapper";

const More: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const CanLoad: boolean = state.BannerAd === "Load";

	return (
		<SafeAreaView style={[styles.main, CanLoad && { paddingBottom: 70 }]}>
			<AdBanner ID={Ads.MORE_SCREEN_BANNER_V1} />
			<ScrollView>
				<Title title="Ajustes" />
				<Link href={"/(more)/profile"} asChild style={styles.profile}>
					<Pressable style={styles.settingList}>
						<Text style={styles.settingListText}>Perfil</Text>
						<Feather name="chevron-right" size={20} color={Colors.text} />
					</Pressable>
				</Link>
				<Link href={"/(more)/custom"} asChild>
					<Pressable style={styles.settingList}>
						<Text style={styles.settingListText}>Personalización</Text>
						<Feather name="chevron-right" size={20} color={Colors.text} />
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
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
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

		borderColor: Colors.text,
		borderBottomWidth: 1,
	},
	settingListText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default More;
