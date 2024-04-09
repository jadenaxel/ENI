import type { FC } from "react";

import { useContext } from "react";

import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Linking } from "react-native";

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { Context } from "@/Wrapper";
import { Colors, Sizes } from "@/config";

const Item: FC = (): JSX.Element => {
	const { state }: any = useContext(Context);
	const ItemData: any = state.SeriesItem;

	const { background, cover, title, description, season, link } = ItemData;

	console.log(link);

	const chapterColor: string = background.asset.metadata.palette.darkMuted.background;

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
			<ImageBackground source={{ uri: background.asset.url }} style={styles.background} blurRadius={6}>
				<View style={styles.header}>
					<Text style={styles.title}>{title}</Text>
					<Pressable onPress={() => router.back()}>
						<Feather name="x" size={25} color={"white"} />
					</Pressable>
				</View>
				<View style={styles.info}>
					<Image style={styles.cover} source={{ uri: cover.asset.url }} />
					<View style={styles.detail}>
						<Text style={styles.description} numberOfLines={6}>
							{description}
						</Text>
						<Feather name="heart" size={25} color={"white"} style={styles.favorite} />
					</View>
				</View>
			</ImageBackground>
			{season && (
				<View style={styles.season}>
					{season.map((item: any, i: number) => {
						return (
							<View key={i}>
								<Text style={styles.seasonTitle}>{item.title}</Text>
								{item.chapter &&
									item.chapter.map((item: any, key: number) => {
										return (
											<Pressable key={key} style={[styles.chapter, { backgroundColor: chapterColor }]}>
												<Text style={styles.chapterTitle}>{item.title}</Text>
												<Pressable onPress={() => Linking.openURL(item.link[0])}>
													<Feather name="download" size={25} color={Colors.text} />
												</Pressable>
											</Pressable>
										);
									})}
							</View>
						);
					})}
				</View>
			)}
			{season === undefined && (
				<Pressable onPress={() => Linking.openURL(link[0])} style={[styles.movieLink, { backgroundColor: chapterColor }]}>
					<Feather name="download" size={25} color={Colors.text} />
					<Text style={styles.downloadMovie}>Descargar</Text>
				</Pressable>
			)}
		</ScrollView>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	background: {
		height: Sizes.windowHeight / 2.5,
		marginBottom: 20,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: Sizes.paddingHorizontal,
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: Sizes.windowHeight / 20,
		marginBottom: Sizes.windowHeight / 90,
	},
	title: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(20),
		width: "80%",
	},
	info: {
		paddingHorizontal: Sizes.paddingHorizontal,
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
	},
	detail: {
		width: "100%",
	},
	cover: {
		width: "35%",
		height: Sizes.windowHeight / 3.5,
		borderRadius: 4,
	},
	description: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		width: "65%",
		marginBottom: 10,
	},
	favorite: {},
	season: {
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	seasonTitle: {
		color: Colors.text,
		marginBottom: 15,
	},
	chapter: {
		borderRadius: 4,
		padding: 10,
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	chapterTitle: {
		color: Colors.text,
	},
	movieLink: {
		marginHorizontal: Sizes.paddingHorizontal,
		borderRadius: 4,
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
	},
	downloadMovie: {
		color: Colors.text,
		marginLeft: 10,
	},
});

export default Item;
