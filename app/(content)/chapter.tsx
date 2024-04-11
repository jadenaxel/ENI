import type { FC } from "react";

import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Option } from "@/components";
import { Colors, Sizes } from "@/config";
import { Context } from "@/Wrapper";

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
			<View>
				<Text style={styles.downloads}>Descargas</Text>
				<Option data={Links.link} />
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
	downloads: {
		fontSize: Sizes.ajustFontSize(20),
		color: Colors.text,
		marginBottom: 20,
	},
});

export default Chapter;
