import type { FC } from "react";

import { View, Text, StyleSheet } from "react-native";

import { Colors, Sizes } from "@/config";

const Title: FC<any> = ({ title }: { title: string }): JSX.Element => {
	return <Text style={styles.title}>{title}</Text>;
};
const styles = StyleSheet.create({
	title: {
		fontSize: Sizes.ajustFontSize(30),
		color: Colors.text,
		textTransform: "uppercase",
	},
});

export default Title;
