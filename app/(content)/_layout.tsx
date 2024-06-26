import type { FC } from "react";

import { Stack } from "expo-router";

const Content: FC = (): JSX.Element => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="item" />
			<Stack.Screen name="chapter" />
		</Stack>
	);
};

export default Content;
