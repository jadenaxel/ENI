import type { FC } from "react";

import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import { Colors, Sizes } from "@/config";
import { Context } from "@/Wrapper";
import { Feather } from "@expo/vector-icons";

const Chapter: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const { Links } = state;
	const { note } = Links;

	return (
		<View style={styles.main}>
			{note && (
				<View style={styles.noteContainer}>
					<Text style={styles.noteTitle}>Nota</Text>
					<Text style={styles.noteContent}>{note}</Text>
				</View>
			)}
			<View style={styles.optionContainer}>
				{Links.link.map((item: any, i: number) => {
					return (
						<Pressable onPress={() => Linking.openURL(item)} key={i} style={styles.option}>
							<Text style={styles.optionText}>Opcion {i + 1}</Text>
							<Feather name="download" size={15} color={"white"} />
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingTop: 50,
	},
	noteContainer: {
		backgroundColor: Colors.black,
		borderRadius: 4,
		padding: 20,
		marginBottom: 20,
	},
	noteTitle: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		marginBottom: 20,
	},
	noteContent: {
		fontSize: Sizes.ajustFontSize(15),
		color: Colors.text,
	},
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

export default Chapter;
