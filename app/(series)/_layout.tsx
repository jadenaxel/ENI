import type { FC } from "react";

import { Stack } from "expo-router";

const Tab: FC = (): JSX.Element => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="item" />
		</Stack>
	);
};

export default Tab;
