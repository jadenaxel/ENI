import type { FC } from "react";

import { Tabs } from "expo-router";

import { Feather } from "@expo/vector-icons";
import { Colors, Sizes } from "@/config";

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
				tabBarInactiveTintColor: Colors.Tint,
				tabBarLabelStyle: {
					fontSize: Sizes.ajustFontSize(13),
				},
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
				name="favorite"
				options={{
					title: "Favorite",
					tabBarIcon: () => <Feather size={25} name="heart" color={Colors.text} />,
					unmountOnBlur: true,
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
