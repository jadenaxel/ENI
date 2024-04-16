import type { FC } from "react";

import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { Link } from "expo-router";

import { Colors, Sizes } from "@/config";
import { Actions } from "@/Wrapper";
import Card from "../Card";

const DATA_SIZE_CONTENT: number = 10;

const CardSection: FC<any> = ({ data, title, dispatch, isLoaded, show, appstore }: any): JSX.Element => {
	return (
		<View>
			<Text style={styles.lastSeriesTitle}>{title}</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lastSeriesContent}>
				{data
					.sort((a: any, b: any) => b._createdAt.localeCompare(a._createdAt))
					.slice(0, DATA_SIZE_CONTENT)
					.map((item: any, i: number) => {
						return (
							<Link key={i} href={"/(content)/item"} asChild>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.SeriesItem, payload: { item, appstore } });
										if (isLoaded) show();
									}}
								>
									<Card item={item} />
								</Pressable>
							</Link>
						);
					})}
			</ScrollView>
		</View>
	);
};
const styles = StyleSheet.create({
	lastSeriesTitle: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		marginVertical: 20,
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	lastSeriesContent: {
		flexDirection: "row",
		gap: 10,
	},
});

export default memo(CardSection);
