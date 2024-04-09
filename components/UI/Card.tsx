import { Colors, Sizes } from "@/config";
import type { FC } from "react";

import { View, Text, StyleSheet, Image } from "react-native";

const Card: FC<any> = (props: any): JSX.Element => {
	const { cover, title } = props.item;

	return (
		<View style={styles.main}>
			<Image source={{ uri: cover.asset.url }} style={styles.cardImage} />
			<Text style={styles.cardTitle}>{title}</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		width: Sizes.windowWidth / 3,
	},
	cardImage: {
		height: 200,
		borderRadius: 4,
		marginBottom: 5,
	},
	cardTitle: {
		color: Colors.text,
		textAlign: "center",
        fontSize: Sizes.windowWidth / 30,
        fontWeight: "bold"
	},
});

export default Card;
