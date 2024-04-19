import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useState, useRef, Fragment } from "react";
import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback, TouchableOpacity, useColorScheme, ScrollView } from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, LocalStorage, Sizes, Constants } from "@/config";
import { Actions, Context } from "@/Wrapper";

const Custom: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;

	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const ColorPrincipal: string = state.colorOne;
	const ColorText: string = state.textColor;

	const SchemeColor: any = Constants.SchemeColor;

	const [value, setValue] = useState<string>(ColorPrincipal);
	const [valueTwo, setValueTwo] = useState<string>(ColorText);
	const [deviceColorState, setDeviceColorState] = useState<string | ColorSchemeName>(DarkModeType);

	const Sheet: any = useRef();
	const Sheet2: any = useRef();

	const Color = (type: string) => Constants.ColorType(type, deviceColor, deviceColorState);
	const ColorTwo = (type: string) => Constants.ColorTypeTwo(type, deviceColor, deviceColorState);

	const TextColor = { color: Color("text") };
	const TextColorTwo = { color: ColorTwo("text") };
	const BGColor = { backgroundColor: Color("background") };
	const BGColorTwo = { backgroundColor: ColorTwo("background") };

	const setColor = async (Action: any, payload: string, Storage: any, Shet?: any) => {
		if (SchemeColor[payload]) setDeviceColorState(payload);

		dispatch({ type: Action, payload });
		await LocalStorage.removeData(Storage);
		await LocalStorage.saveData(Storage, payload);

		if (Shet) Shet?.current?.close();
	};

	return (
		<SafeAreaView style={[styles.main, BGColor]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={[styles.title, TextColor]}>Personalización</Text>
				<View style={styles.color}>
					<Fragment>
						<Text style={[styles.colorActualText, TextColor]}>Color de fondo</Text>
						<View style={styles.deviceColor}>
							<Text
								style={[styles.deviceColorText, BGColorTwo, TextColorTwo]}
								onPress={() => setColor(Actions.DarkMode, Constants.SchemeColor.auto, Constants.StorageType.DeviceColor)}
							>
								Auto
							</Text>
							<Text
								style={[styles.deviceColorText, BGColorTwo, TextColorTwo]}
								onPress={() => setColor(Actions.DarkMode, Constants.SchemeColor.light, Constants.StorageType.DeviceColor)}
							>
								Claro
							</Text>
							<Text
								style={[styles.deviceColorText, BGColorTwo, TextColorTwo]}
								onPress={() => setColor(Actions.DarkMode, Constants.SchemeColor.dark, Constants.StorageType.DeviceColor)}
							>
								Oscuro
							</Text>
						</View>
					</Fragment>
					<View>
						<Text style={[styles.colorActualText, TextColor]}>Color Principal</Text>
						<Pressable onPress={() => Sheet?.current?.open()} style={[styles.colorPicker, BGColorTwo]}>
							<View style={[styles.colorActualBox, { backgroundColor: value }]} />
						</Pressable>
					</View>
					<View>
						<Text style={[styles.colorActualText, TextColor]}>Color de Texto</Text>
						<Pressable onPress={() => Sheet2?.current?.open()} style={[styles.colorPicker, BGColorTwo]}>
							<View style={[styles.colorActualBox, { backgroundColor: valueTwo }]} />
						</Pressable>
					</View>
				</View>

				<RBSheet customStyles={{ container: [styles.sheet, BGColor] }} height={Sizes.windowHeight / 2} openDuration={250} ref={Sheet}>
					<View style={styles.sheetHeader}>
						<Text style={[styles.sheetHeaderTitle, TextColor]}>Selecciona un color</Text>
					</View>
					<View style={styles.group}>
						{Colors.categories.map((item: any, index: number) => {
							const isActive: boolean = value === item;

							return (
								<TouchableWithoutFeedback onPress={() => setValue(item)} key={index}>
									<View style={[styles.circle, BGColorTwo, isActive && { backgroundColor: item }]}>
										<View style={[styles.circleInside, { backgroundColor: item }]} />
									</View>
								</TouchableWithoutFeedback>
							);
						})}
					</View>
					<TouchableOpacity
						style={[styles.btn, BGColorTwo]}
						onPress={() => setColor(Actions.PrincipalColor, value, Constants.StorageType.PrincipalColor, Sheet)}
					>
						<Text style={[styles.btnText, TextColorTwo]}>Confirmar</Text>
					</TouchableOpacity>
				</RBSheet>
				<RBSheet customStyles={{ container: [styles.sheet, BGColor] }} height={Sizes.windowHeight / 2} openDuration={250} ref={Sheet2}>
					<View style={styles.sheetHeader}>
						<Text style={[styles.sheetHeaderTitle, TextColor]}>Selecciona un color</Text>
					</View>
					<View style={styles.group}>
						{[Colors.text, Colors.background].map((item: any, index: number) => {
							const isActive: boolean = value === item;

							return (
								<TouchableWithoutFeedback onPress={() => setValueTwo(item)} key={index}>
									<View style={[styles.circle, BGColorTwo, isActive && { backgroundColor: item }]}>
										<View style={[styles.circleInside, { backgroundColor: item }]} />
									</View>
								</TouchableWithoutFeedback>
							);
						})}
					</View>
					<TouchableOpacity
						style={[styles.btn, BGColorTwo]}
						onPress={() => setColor(Actions.TextColor, valueTwo, Constants.StorageType.TextColor, Sheet2)}
					>
						<Text style={[styles.btnText, TextColorTwo]}>Confirmar</Text>
					</TouchableOpacity>
				</RBSheet>
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
	color: {
		gap: 20,
	},
	deviceColor: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
	},
	deviceColorText: {
		padding: 20,
		borderRadius: 4,
		flex: 1,
		textAlign: "center",
	},
	colorPicker: {
		borderRadius: 4,
		height: 80,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 5,
	},
	colorActualBox: {
		borderRadius: 4,
		width: "100%",
		height: 70,
	},
	colorActualText: {
		fontSize: Sizes.ajustFontSize(16),
		marginBottom: 10,
	},
	sheet: {
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
		marginBottom: 12,
	},
	btnText: {
		fontSize: Sizes.ajustFontSize(16),
		fontWeight: "600",
	},
});

export default Custom;
