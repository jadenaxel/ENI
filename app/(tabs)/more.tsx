import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, useColorScheme, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";

import { Colors, Constants, Sizes, MoreScreen, LocalStorage } from "@/config";
import { Loader, Title } from "@/components";
import { Context } from "@/Wrapper";

const More: FC = (): JSX.Element => {
	const [profiileImage, setProfileImage] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { state }: any = useContext(Context);
	const { colorOne, textColor, darkMode } = state;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const REPORT_ERROR: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Error"`;

	const getUserData = async () => {
		const userData = await LocalStorage.getData("profile");
		if (userData.length <= 0) {
			setIsLoading(false);
			return;
		}
		const parsingUserData = JSON.parse(userData);
		setProfileImage(parsingUserData.profiileImage);
		setName(parsingUserData.name);
		setIsLoading(false);
	};

	useFocusEffect(
		useCallback(() => {
			getUserData();
		}, [name, profiileImage])
	);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView>
				<Title title="Ajustes" deviceColor={deviceColor} DarkModeType={DarkModeType} />

				{!profiileImage && (
					<View style={styles.profile}>
						<View style={styles.photo}></View>
						<Text style={styles.profileName}>Ejemplo Sanchez</Text>
					</View>
				)}
				{profiileImage && (
					<View style={styles.profile}>
						<Image source={{ uri: profiileImage }} style={styles.photo} />
						<Text style={styles.profileName}>{name}</Text>
					</View>
				)}

				<View style={{ marginBottom: 20 }}>
					{MoreScreen.menu.map((item: any, i: number) => {
						return (
							<Link href={item.link} asChild key={i}>
								<Pressable>
									<View style={[styles.settingList, { borderBottomColor: Constants.ColorType("text", deviceColor, DarkModeType) }]}>
										<Text style={[styles.settingListText, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>
											{item.title}
										</Text>
										<Feather name="chevron-right" size={20} color={Constants.ColorType("text", deviceColor, DarkModeType)} />
									</View>
								</Pressable>
							</Link>
						);
					})}
				</View>
				<Pressable onPress={() => Linking.openURL("https://t.me/ENIDATA")} style={[styles.button, { backgroundColor: colorOne }]}>
					<Text style={[styles.buttonText, { color: textColor }]}>Unete al nuestro canal</Text>
				</Pressable>
				<Pressable onPress={() => Linking.openURL(REPORT_ERROR)} style={[styles.button, { backgroundColor: colorOne }]}>
					<Text style={[styles.buttonText, { color: textColor }]}>Reportar Error</Text>
				</Pressable>
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
		marginTop: 30,
		alignItems: "center",
	},
	photo: {
		width: 100,
		height: 100,
		backgroundColor: "red",
		borderRadius: 50,
		alignSelf: "center",
		justifyContent: "flex-end",
		overflow: "hidden",
		marginBottom: 10,
	},
	profileName: {
		fontSize: Sizes.ajustFontSize(15),
		marginBottom: 30,
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
