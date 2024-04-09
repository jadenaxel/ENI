import type { FC } from "react";

import { Stack } from "expo-router";

const Root: FC = (): JSX.Element => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default Root;
