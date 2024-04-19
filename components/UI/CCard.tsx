import type { FC } from "react";

import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Colors, Constants, Sizes } from "@/config";

const CategoriesCard: FC<any> = ({ title, deviceColor, DarkModeType }: any): JSX.Element => {
	return (
		<View style={[styles.main, { backgroundColor: Colors.categories[Math.floor(Math.random() * Colors.categories.length)] }]}>
			<Text style={[styles.title, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{title}</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		borderRadius: 6,
		padding: 10,
		height: Sizes.windowHeight / 10,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: Sizes.ajustFontSize(14),
	},
});

export default memo(CategoriesCard);
