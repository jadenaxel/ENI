import type { FC } from "react";

import { Modal, View, ScrollView, Pressable, Text, StyleSheet } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Colors, Sizes } from "@/config";

const SeasonModal: FC<any> = ({ modalSeasonVisible, setModalSeasonVisible, setSelectedSeason, selectedSeason, data }: any): JSX.Element => (
	<Modal visible={modalSeasonVisible} animationType="slide" transparent>
		<View style={styles.modal}>
			<ScrollView contentContainerStyle={styles.modalItem}>
				{data.map((item: any, i: number) => {
					return (
						<Pressable
							key={i}
							onPress={() => {
								setSelectedSeason(item.title);
								setModalSeasonVisible(false);
							}}
						>
							<Text style={[styles.seasonTitleModal, selectedSeason === item.title && { fontSize: Sizes.ajustFontSize(20) }]}>{item.title}</Text>
						</Pressable>
					);
				})}
			</ScrollView>

			<Pressable style={styles.closeModal} onPress={() => setModalSeasonVisible(false)}>
				<Feather name="x" size={20} color={Colors.background} />
			</Pressable>
		</View>
	</Modal>
);

export default SeasonModal;

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: "center",
		paddingVertical: Sizes.paddingHorizontal + 30,
		backgroundColor: "rgba(0,0,0,.9)",
	},
	modalItem: {
		flex: 1,
		justifyContent: "center",
		marginBottom: 30,
	},
	closeModal: {
		backgroundColor: Colors.text,
		width: 50,
		height: 50,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	seasonTitleModal: {
		marginBottom: 40,
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		textAlign: "center",
	},
});
