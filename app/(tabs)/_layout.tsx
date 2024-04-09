import type { FC } from "react";

import { Tabs } from "expo-router";

import { Feather } from "@expo/vector-icons";
import { Colors } from "@/config";

const Tab: FC = (): JSX.Element => {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors.background,
					borderTopWidth: 0,
				},
				tabBarActiveTintColor: Colors.text,
				tabBarInactiveTintColor: "#0e2",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: () => <Feather size={25} name="home" color={Colors.text} />,
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: () => <Feather size={25} name="search" color={Colors.text} />,
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: "Settings",
					tabBarIcon: () => <Feather size={25} name="settings" color={Colors.text} />,
				}}
			/>
		</Tabs>
	);
};

export default Tab;
