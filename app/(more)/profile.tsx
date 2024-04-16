import type { FC } from "react";

import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from "react-native";

import { Sizes, Colors, LocalStorage } from "@/config";
import { Actions, Context } from "@/Wrapper";

const Profile: FC = (): JSX.Element => {
	const [name, setName] = useState<string>("");
	const [checkData, setCheckData] = useState<string>("");
	const { state, dispatch }: any = useContext(Context);

	const checkName = state.store;

	const getData = async () => {
		const data = await LocalStorage.getData("appstore");
		if (data.length > 0) setCheckData(data[0]);
	};

	const saveData = () => {
		dispatch({ type: Actions.Store, payload: name });
		LocalStorage.saveData("appstore", name);
	};

	const reset = async () => {
		await LocalStorage.removeData("appstore");
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<View style={styles.main}>
			<Text style={styles.profile}>Perfil</Text>
			<View style={styles.name}>
				<Text style={styles.nameText}>Nombre: </Text>
				<TextInput
					style={styles.nameInput}
					placeholder="Name: "
					onChangeText={(e: any) => setName(e)}
					placeholderTextColor={Colors.text}
					defaultValue={checkData.length > 0 ? checkData : checkName}
				/>
			</View>
			<View style={styles.actionButton}>
				<TouchableHighlight onPress={saveData} style={styles.saveButton}>
					<Text style={styles.save}>Guardar</Text>
				</TouchableHighlight>
				<TouchableHighlight onPress={reset} style={styles.saveButton}>
					<Text style={styles.save}>Reset</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	profile: {
		marginTop: 40,
		marginBottom: 20,
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(25),
		textAlign: "center",
	},
	name: {
		marginBottom: 20,
	},
	nameText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(18),
		marginBottom: 5,
	},
	nameInput: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
		borderRadius: 4,
		borderColor: Colors.text,
		borderWidth: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	actionButton: {
		flexDirection: "row",
		gap: 10,
	},
	saveButton: {
		backgroundColor: Colors.Tint,
		borderRadius: 4,
		padding: 15,
		alignItems: "center",
		marginBottom: 10,
		flex: 1,
	},
	save: {
		color: Colors.background,
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Profile;
