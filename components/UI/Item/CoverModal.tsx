import type { FC } from "react";

import { View, StyleSheet, Modal, Pressable, Image } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Colors, Sizes } from "@/config";

const CoverModal: FC<any> = ({ modalCoverVisible, setModalCoverVisible, image }): JSX.Element => {
	return (
		<Modal animationType="slide" transparent visible={modalCoverVisible}>
			<View style={styles.modal}>
				<Image source={{ uri: image }} style={styles.image} />
				<Pressable style={styles.closeModal} onPress={() => setModalCoverVisible((e: boolean) => !e)}>
					<Feather name="x" size={20} color={Colors.background} />
				</Pressable>
			</View>
		</Modal>
	);
};
const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: Sizes.paddingHorizontal + 30,
		backgroundColor: "rgba(0,0,0,.9)",
	},
	image: {
		width: Sizes.windowHeight / 3,
		height: Sizes.windowHeight / 2,
		borderRadius: 4,
	},
	closeModal: {
		backgroundColor: Colors.text,
		width: 50,
		height: 50,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default CoverModal;
