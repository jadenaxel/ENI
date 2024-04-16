import type { FC } from "react";

import { useContext, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";

import { Colors, LocalStorage, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Loader } from "@/components";

const Custom: FC = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(true);
	const { state, dispatch }: any = useContext(Context);

	const ColorPrincipal: string = state.colorOne;
	const ColorText: string = state.textColor;

	const [value, setValue] = useState<string>(ColorPrincipal);
	const [valueTwo, setValueTwo] = useState<string>(ColorText);

	const Sheet: any = useRef();
	const Sheet2: any = useRef();

	const SetPrincipaColor = async () => {
		dispatch({ type: Actions.PrincipalColor, payload: value });
		await LocalStorage.removeData("PrincipaColor");
		await LocalStorage.saveData("PrincipaColor", value);
		Sheet?.current?.close();
	};

	const SetTextColor = async () => {
		dispatch({ type: Actions.TextColor, payload: valueTwo });
		await LocalStorage.removeData("TextColor");
		await LocalStorage.saveData("TextColor", valueTwo);
		Sheet2?.current?.close();
	};

	const LoadColor = async () => {
		const PrincipalColor = await LocalStorage.getData("PrincipaColor");
		const TextColor = await LocalStorage.getData("TextColor");

		if (PrincipalColor.length > 0 && PrincipalColor !== null) setValue(PrincipalColor[0]);
		if (TextColor.length > 0 && TextColor !== null) setValueTwo(TextColor[0]);

		setLoading(false);
	};

	useEffect(() => {
		LoadColor();
	}, []);

	if (loading) return <Loader />;

	return (
		<View style={styles.main}>
			<Text style={styles.title}>Personalización</Text>
			<View style={styles.color}>
				<View style={styles.colorActual}>
					<Pressable onPress={() => Sheet?.current?.open()} style={styles.colorBorder}>
						<View style={[styles.colorActualBox, { backgroundColor: value }]} />
					</Pressable>
					<Text style={styles.colorActualText}>Color Principal</Text>
				</View>
				<View style={styles.colorActual}>
					<Pressable onPress={() => Sheet2?.current?.open()} style={styles.colorBorder}>
						<View style={[styles.colorActualBox, { backgroundColor: valueTwo }]} />
					</Pressable>
					<Text style={styles.colorActualText}>Color Texto</Text>
				</View>
			</View>
			<RBSheet customStyles={{ container: styles.sheet }} height={Sizes.windowHeight / 2} openDuration={250} ref={Sheet}>
				<View style={styles.sheetHeader}>
					<Text style={styles.sheetHeaderTitle}>Selecciona un color</Text>
				</View>
				<View style={styles.group}>
					{Colors.categories.map((item: any, index: number) => {
						const isActive: boolean = value === item;

						return (
							<TouchableWithoutFeedback onPress={() => setValue(item)} key={index}>
								<View style={[styles.circle, isActive && { backgroundColor: item }]}>
									<View style={[styles.circleInside, { backgroundColor: item }]} />
								</View>
							</TouchableWithoutFeedback>
						);
					})}
				</View>
				<TouchableOpacity style={styles.btn} onPress={SetPrincipaColor}>
					<Text style={styles.btnText}>Confirm</Text>
				</TouchableOpacity>
			</RBSheet>
			<RBSheet customStyles={{ container: styles.sheet }} height={Sizes.windowHeight / 2} openDuration={250} ref={Sheet2}>
				<View style={styles.sheetHeader}>
					<Text style={styles.sheetHeaderTitle}>Selecciona un color</Text>
				</View>
				<View style={styles.group}>
					{[Colors.text, Colors.background].map((item: any, index: number) => {
						const isActive: boolean = value === item;

						return (
							<TouchableWithoutFeedback onPress={() => setValueTwo(item)} key={index}>
								<View style={[styles.circle, isActive && { backgroundColor: item }]}>
									<View style={[styles.circleInside, { backgroundColor: item }]} />
								</View>
							</TouchableWithoutFeedback>
						);
					})}
				</View>
				<TouchableOpacity style={styles.btn} onPress={SetTextColor}>
					<Text style={styles.btnText}>Confirm</Text>
				</TouchableOpacity>
			</RBSheet>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	title: {
		marginTop: 40,
		marginBottom: 20,
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(25),
		textAlign: "center",
	},
	color: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	colorActual: {
		alignItems: "center",
		justifyContent: "center",
		height: Sizes.windowHeight - 180,
	},
	colorBorder: {
		borderRadius: 150,
		width: 80,
		height: 80,
		backgroundColor: Colors.text,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	colorActualBox: {
		borderRadius: 150,
		width: 70,
		height: 70,
	},
	colorActualText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
	},
	sheet: {
		backgroundColor: Colors.background,
		borderTopLeftRadius: 14,
		borderTopRightRadius: 14,
	},
	sheetHeader: {
		borderBottomWidth: 1,
		borderBottomColor: "#efefef",
		paddingHorizontal: 24,
		paddingVertical: 14,
		marginBottom: 20,
	},
	sheetHeaderTitle: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		fontWeight: "600",
		textAlign: "center",
	},
	group: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		flexWrap: "wrap",
		paddingHorizontal: Sizes.paddingHorizontal,
		marginBottom: 30,
	},
	circle: {
		width: 60,
		height: 60,
		borderRadius: 9999,
		backgroundColor: Colors.text,
		borderColor: "transparent",
		marginRight: 8,
		marginBottom: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	circleInside: {
		width: 50,
		height: 50,
		borderRadius: 9999,
	},
	btn: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 6,
		marginHorizontal: Sizes.paddingHorizontal,
		padding: 14,
		borderWidth: 1,
		borderColor: Colors.text,
		backgroundColor: Colors.text,
		marginBottom: 12,
	},
	btnText: {
		fontSize: Sizes.ajustFontSize(16),
		fontWeight: "600",
		color: Colors.background,
	},
});

export default Custom;
