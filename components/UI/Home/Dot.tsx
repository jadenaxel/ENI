import type { FC } from "react";

import { View, StyleSheet, Animated } from "react-native";

import { Constants, Sizes } from "@/config";

const Dot: FC<any> = ({ data, scrollX, deviceColor, DarkModeType, PrincipalColor }: any): JSX.Element => {
	return (
		<View style={styles.container}>
			{data.map((_: any, idx: any) => {
				const inputRange = [(idx - 1) * Sizes.windowWidth, idx * Sizes.windowWidth, (idx + 1) * Sizes.windowWidth];

				const dotWidth = scrollX.interpolate({
					inputRange,
					outputRange: [12, 30, 12],
					extrapolate: "clamp",
				});

				const backgroundColor = scrollX.interpolate({
					inputRange,
					outputRange: [
						Constants.ColorTypeTwo("background", deviceColor, DarkModeType),
						PrincipalColor,
						Constants.ColorTypeTwo("background", deviceColor, DarkModeType),
					],
					extrapolate: "clamp",
				});

				return <Animated.View key={idx.toString()} style={[styles.dot, { width: dotWidth, backgroundColor }]} />;
			})}
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginHorizontal: 3,
	},
});

export default Dot;
