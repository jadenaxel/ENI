import type { FC } from "react";

import { Stack } from "expo-router";

import Wrapper from "@/Wrapper";

const Root: FC = (): JSX.Element => {
	return (
		<Wrapper>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="(content)" options={{ headerShown: false }} />
				<Stack.Screen name="(search)" options={{ headerShown: false }} />
			</Stack>
		</Wrapper>
	);
};

export default Root;
