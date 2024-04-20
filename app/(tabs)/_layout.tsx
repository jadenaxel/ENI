import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Constants, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Loader } from "@/components";

const Tab: FC = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(true);
	const { state, dispatch }: any = useContext(Context);

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const userColor: string = state.colorOne;

	useEffect(() => {
		Constants.LoadColor(setLoading, dispatch, Actions);
	}, []);

	if (loading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType),
					borderTopWidth: 0,
				},
				tabBarActiveTintColor: Constants.ColorType("text", deviceColor, DarkModeType),
				tabBarInactiveTintColor: userColor,
				tabBarLabelStyle: {
					fontSize: Sizes.ajustFontSize(13),
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Inicio",
					tabBarIcon: () => <Feather size={20} name="home" color={Constants.ColorType("text", deviceColor, DarkModeType)} />,
				}}
			/>
			<Tabs.Screen
				name="favorite"
				options={{
					title: "Favoritas",
					tabBarIcon: () => <Feather size={20} name="heart" color={Constants.ColorType("text", deviceColor, DarkModeType)} />,
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Buscar",
					tabBarIcon: () => <Feather size={20} name="search" color={Constants.ColorType("text", deviceColor, DarkModeType)} />,
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: "Ajustes",
					tabBarIcon: () => <Feather size={20} name="settings" color={Constants.ColorType("text", deviceColor, DarkModeType)} />,
				}}
			/>
		</Tabs>
	);
};

export default Tab;
