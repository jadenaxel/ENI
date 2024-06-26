import type { FC } from "react";

import { Stack } from "expo-router";

const Search: FC = (): JSX.Element => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="categories" />
		</Stack>
	);
};

export default Search;
