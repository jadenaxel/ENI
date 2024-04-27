import type { FC } from "react";

import { Stack } from "expo-router";

const More: FC = (): JSX.Element => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="custom" />
			<Stack.Screen name="about" />
		</Stack>
	);
};

export default More;
