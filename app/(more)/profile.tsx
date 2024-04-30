import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, useColorScheme, ScrollView, TouchableOpacity, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Constants, Sizes, LocalStorage } from "@/config";
import { Context } from "@/Wrapper";
import { Loader } from "@/components";

const Profile: FC = (): JSX.Element => {
	const [profiileImage, setProfileImage] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { state }: any = useContext(Context);

	const { darkMode } = state;

	const deviceColor: ColorSchemeName = useColorScheme();

	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const Color = (type: string) => Constants.ColorType(type, deviceColor, DarkModeType);
	const ColorTwo = (type: string) => Constants.ColorTypeTwo(type, deviceColor, DarkModeType);

	const TextColor = { color: Color("text") };
	const TextColorTwo = { color: ColorTwo("text") };
	const BGColor = { backgroundColor: Color("background") };
	const BGColorTwo = { backgroundColor: ColorTwo("background") };

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				selectionLimit: 1,
				allowsMultipleSelection: false,
			});
			if (!result.canceled) setProfileImage(result.assets[0].uri);
		} catch {}
	};

	const handleUserData = async (): Promise<void> => {
		if (name.length <= 0 && profiileImage.length <= 0) {
			Alert.alert("Introduce tu nombre");
			return;
		}
		await LocalStorage.removeData("profile");
		await LocalStorage.saveData("profile", JSON.stringify({ name, profiileImage }));
		Alert.alert("Datos guardados!!!");
	};

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

	useEffect(() => {
		getUserData();
	}, []);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<SafeAreaView style={[styles.main, BGColor]}>
			<ScrollView>
				<Text style={[styles.title, TextColor]}>Perfil</Text>
				{!profiileImage && (
					<View style={styles.profile}>
						<Pressable style={styles.photo} onPress={() => pickImage()}>
							<Text style={styles.choosePhotoText}>Elegit foto</Text>
						</Pressable>
					</View>
				)}
				{profiileImage && (
					<Pressable style={styles.profile} onPress={() => pickImage()}>
						<Image source={{ uri: profiileImage }} style={styles.photo} />
					</Pressable>
				)}
				<TextInput
					placeholder="Nombre Completo"
					style={[styles.name, { borderColor: ColorTwo("background") }]}
					placeholderTextColor={Color("text")}
					onChangeText={(e) => setName(e)}
					defaultValue={name}
				/>
				{/* <TextInput placeholder="E-Mail" style={[styles.name, { borderColor: ColorTwo("background") }]} placeholderTextColor={Color("text")} /> */}

				<TouchableOpacity style={[styles.save, BGColorTwo]} onPress={handleUserData}>
					<Text style={[styles.saveText, TextColorTwo]}>Guardar</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	title: {
		marginTop: 10,
		marginBottom: 20,
		fontSize: Sizes.ajustFontSize(25),
		textAlign: "center",
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
	choosePhotoText: {
		textAlign: "center",
		backgroundColor: "blue",
		height: 35,
		color: "white",
		fontSize: Sizes.ajustFontSize(13),
	},
	profileName: {
		fontSize: Sizes.ajustFontSize(15),
		marginBottom: 30,
	},
	name: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 4,
		marginBottom: 20,
		fontSize: Sizes.ajustFontSize(15),
	},
	save: {
		padding: 10,
		borderRadius: 4,
		alignItems: "center",
	},
	saveText: {
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Profile;
