import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

import { Colors, Sizes } from "@/config";

const Error: FC = (): JSX.Element => {
	return (
		<View style={styles.main}>
			<Text style={styles.text}>Error al cargar los datos. Reinicia la aplicacion.</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	text: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
	},
});

export default Error;
