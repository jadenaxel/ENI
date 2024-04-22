import type { FC } from "react";

import { memo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { Constants, Sizes } from "@/config";

const Card: FC<any> = (props: any): JSX.Element => {
	const { deviceColor, DarkModeType } = props;
	const { coverURL, title } = props.item;

	return (
		<View style={styles.main}>
			<Image source={{ uri: coverURL }} style={[styles.cardImage, { borderColor: Constants.ColorTypeTwo("background", deviceColor, DarkModeType) }]} />
			<Text style={[styles.cardTitle, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]} numberOfLines={2}>
				{title}
			</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		width: Sizes.windowWidth / 3.5,
	},
	cardImage: {
		height: 190,
		borderRadius: 4,
		marginBottom: 5,
		borderWidth: 1,
	},
	cardTitle: {
		textAlign: "center",
		fontSize: Sizes.ajustFontSize(13),
	},
});

export default memo(Card);
