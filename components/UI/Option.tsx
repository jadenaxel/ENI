import type { FC } from "react";

import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import { Colors, Sizes } from "@/config";
import { Feather } from "@expo/vector-icons";

const Option: FC<any> = ({ data }: any): JSX.Element => {
	return (
		<View style={styles.optionContainer}>
			{data.map((item: any, i: number) => {
				return (
					<Pressable onPress={() => Linking.openURL(item)} key={i} style={styles.option}>
						<Text style={styles.optionText}>Opcion {i + 1}</Text>
						<Feather name="download" size={15} color={"white"} />
					</Pressable>
				);
			})}
		</View>
	);
};
const styles = StyleSheet.create({
	main: {},
	optionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	option: {
		backgroundColor: Colors.Tint,
		padding: 15,
		borderRadius: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		width: Sizes.windowWidth / 3.46,
	},
	optionText: {
		color: Colors.text,
		marginRight: 5,
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Option;
