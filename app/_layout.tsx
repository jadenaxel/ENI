import type { FC } from "react";

import "expo-dev-client"
import { Stack } from "expo-router";
import { vexo } from "vexo-analytics";

import Wrapper from "@/Wrapper";

__DEV__ ? null : vexo("c17e530e-32b7-4e1d-85be-2a6495cbf2db");

const Root: FC = (): JSX.Element => {
	return (
		<Wrapper>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="(content)" options={{ headerShown: false }} />
				<Stack.Screen name="(search)" options={{ headerShown: false }} />
				<Stack.Screen name="(more)" options={{ headerShown: false }} />
			</Stack>
		</Wrapper>
	);
};

export default Root;
