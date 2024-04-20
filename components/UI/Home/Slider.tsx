import type { FC } from "react";

import { memo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { Colors, Sizes } from "@/config";

const Slider: FC<any> = (props: any): JSX.Element => {
	const { title, background, backgroundURL }: any = props.item;

	return (
		<View style={styles.main}>
			<Image source={{ uri: background ?? backgroundURL }} style={styles.image} resizeMode="cover" borderRadius={10} />
			<View style={styles.cover}>
				<Text style={styles.text}>{title}</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		width: Sizes.windowWidth - 20,
		marginTop: 30,
		marginHorizontal: 10,
	},
	image: {
		width: "100%",
		height: Sizes.windowHeight / 4,
	},
	cover: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,.6)",
		position: "absolute",
		bottom: 0,
		height: Sizes.windowHeight / 16,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		width: "90%",
		textAlign: "center",
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default memo(Slider);
