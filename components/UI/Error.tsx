import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

import { Constants, Sizes } from "@/config";

const Error: FC<any> = ({ deviceColor, DarkModeType }: any): JSX.Element => {
	return (
		<View style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<Text style={[styles.text, Constants.ColorType("text", deviceColor, DarkModeType)]}>Error al cargar los datos. Reinicia la aplicacion.</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	text: {
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default Error;
