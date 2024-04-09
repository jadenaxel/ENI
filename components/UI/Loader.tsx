import type { FC } from "react";

import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Colors } from "@/config";

const Loader: FC = (): JSX.Element => {
	return (
		<View style={styles.main}>
			<ActivityIndicator color={Colors.Tint} size={30} />
		</View>
	);
};
const styles = StyleSheet.create({
	main: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
});

export default Loader;
