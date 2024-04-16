import type { FC } from "react";

import { useContext, useState, useEffect } from "react";

import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Colors, LocalStorage, Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";
import { Loader } from "@/components";

const Tab: FC = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(true);
	const { state, dispatch }: any = useContext(Context);

	const userColor: string = state.colorOne;

	const LoadColor = async () => {
		const PrincipalColor = await LocalStorage.getData("PrincipaColor");

		if (PrincipalColor.length > 0 && PrincipalColor !== null) dispatch({ type: Actions.PrincipalColor, payload: PrincipalColor[0] });
		else dispatch({ type: Actions.PrincipalColor, payload: Colors.Tint });

		setLoading(false);
	};

	useEffect(() => {
		LoadColor();
	}, []);

	if (loading) return <Loader />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors.background,
					borderTopWidth: 0,
				},
				tabBarActiveTintColor: Colors.text,
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
					tabBarIcon: () => <Feather size={20} name="home" color={Colors.text} />,
				}}
			/>
			<Tabs.Screen
				name="favorite"
				options={{
					title: "Favoritas",
					tabBarIcon: () => <Feather size={20} name="heart" color={Colors.text} />,
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Buscar",
					tabBarIcon: () => <Feather size={20} name="search" color={Colors.text} />,
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: "Ajustes",
					tabBarIcon: () => <Feather size={20} name="settings" color={Colors.text} />,
				}}
			/>
		</Tabs>
	);
};

export default Tab;
