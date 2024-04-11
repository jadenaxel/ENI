import { Colors, Sizes } from "@/config";
import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

const COLORS_TEM: string[] = ["#ffc857", "#f49d52", "#e9724c", "#d74d45", "#c5283d", "#872331", "#481d24", "#402e3d", "#373e55", "#255f85"];

const CategoriesCard: FC<any> = ({ title }: { title: string }): JSX.Element => {
	return (
		<View style={[styles.main, { backgroundColor: COLORS_TEM[Math.floor(Math.random() * COLORS_TEM.length)] }]}>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		width: Sizes.windowWidth / 2.3,
		borderRadius: 6,
		padding: 10,
		height: Sizes.windowHeight / 10,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(14),
	},
});

export default CategoriesCard;
