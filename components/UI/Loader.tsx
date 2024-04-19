import type { FC } from "react";

import { useContext } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Constants } from "@/config";
import { Context } from "@/Wrapper";

const Loader: FC<any> = ({ deviceColor, DarkModeType }: any): JSX.Element => {
	const { state }: any = useContext(Context);

	const PrincipalColor: string = state.colorOne;

	return (
		<View style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ActivityIndicator color={PrincipalColor} size={30} />
		</View>
	);
};
const styles = StyleSheet.create({
	main: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Loader;
