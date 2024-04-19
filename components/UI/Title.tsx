import type { FC } from "react";

import { Text, StyleSheet } from "react-native";

import { Constants, Sizes } from "@/config";

const Title: FC<any> = ({ title, deviceColor, DarkModeType }: any): JSX.Element => {
	return <Text style={[styles.title, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{title}</Text>;
};
const styles = StyleSheet.create({
	title: {
		fontSize: Sizes.ajustFontSize(30),
		textTransform: "uppercase",
	},
});

export default Title;
