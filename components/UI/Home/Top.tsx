import type { FC } from "react";

import { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { Link } from "expo-router";

import Card from "../Card";
import { Sizes } from "@/config";
import { Actions, Context } from "@/Wrapper";

const Top: FC<any> = ({ title, type, data, isLoaded, show, deviceColor, DarkModeType }: any): JSX.Element => {
	const { dispatch }: any = useContext(Context);

	return (
		<View style={styles.card}>
			<Text style={styles.cardTitle}>{title}</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardBody}>
				{data
					.sort((a: any, b: any) => {
						const like1 = a.like ?? 0;
						const like2 = b.like ?? 0;

						return like2 - like1;
					})
					.filter((item: any) => (type === "series" ? item.hasOwnProperty("season") : !item.hasOwnProperty("season")))
					.slice(0, 10)
					.map((item: any, i: any) => {
						return (
							<Link href={"/(content)/item"} asChild key={i}>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.SeriesItem, payload: { item: item._id } });
										if (isLoaded) show();
									}}
								>
									<Card item={item} deviceColor={deviceColor} DarkModeType={DarkModeType} />
								</Pressable>
							</Link>
						);
					})}
			</ScrollView>
		</View>
	);
};
const styles = StyleSheet.create({
	card: {
		paddingHorizontal: Sizes.paddingHorizontal,
		marginTop: 30,
	},
	cardTitle: {
		fontSize: Sizes.ajustFontSize(20),
		marginBottom: 30,
	},
	cardBody: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 10,
	},
});

export default Top;
