import type { FC } from "react";

import { useContext } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Colors } from "@/config";
import { Context } from "@/Wrapper";

const Loader: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);

	const PrincipalColor: string = state.colorOne;

	return (
		<View style={styles.main}>
			<ActivityIndicator color={PrincipalColor} size={30} />
		</View>
	);
};
const styles = StyleSheet.create({
	main: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
});

export default Loader;
