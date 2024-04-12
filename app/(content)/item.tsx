import type { FC } from "react";

import { useContext, useEffect, useState } from "react";

import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Linking, Modal } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { Actions, Context } from "@/Wrapper";
import { Ads, Colors, Sizes, LocalStorage, Constants } from "@/config";
import { AdBanner, CoverModal, Option, SeasonModal } from "@/components";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.CHAPTER_LAST_HOME_INTERSTITIAL_V1;

const Item: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);
	const ItemData: any = state.SeriesItem;

	const [modalSeasonVisible, setModalSeasonVisible] = useState<boolean>(false);
	const [modalCoverVisible, setModalCoverVisible] = useState<boolean>(false);

	const [heart, setHeart] = useState<boolean>(false);
	const [selectedSeason, setSelectedSeason] = useState<string>(ItemData.season?.at(-1).title ?? "");

	const { isLoaded, load, show } = useInterstitialAd(AD_STRING);

	const { background, backgroundURL, cover, coverURL, title, description, season, link } = ItemData;
	const chapterColor: string = background?.asset.metadata.palette.darkMuted.background ?? Colors.red;

	const contentType: string = season !== null ? Constants.SERIES : Constants.MOVIES;

	const getStorageData = async (title: string) => {
		const contentData = await LocalStorage.getData(contentType, title);
		setHeart(contentData?.length > 0 ? true : false);
	};

	const handleHeart = async () => {
		heart ? await LocalStorage.removeData(contentType, ItemData) : await LocalStorage.saveData(contentType, ItemData);
		setHeart((prev: boolean): boolean => !prev);
	};

	useEffect(() => {
		getStorageData(title);
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<View style={styles.main}>
			<AdBanner ID={Ads.ITEM_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<ImageBackground source={{ uri: backgroundURL ?? background?.asset.url }} style={styles.background} blurRadius={6}>
					<View style={styles.backgroundColor}>
						<View style={styles.header}>
							<Text numberOfLines={1} style={styles.title}>
								{title}
							</Text>
							<Pressable onPress={() => router.back()}>
								<Feather name="x" size={25} color={"white"} />
							</Pressable>
						</View>
						<View style={styles.info}>
							<Pressable style={styles.covermodal} onPress={() => setModalCoverVisible(true)}>
								<Image style={styles.cover} source={{ uri: coverURL ?? cover?.asset.url }} />
							</Pressable>
							<View style={styles.detail}>
								<Text style={styles.description} numberOfLines={10}>
									{description}
								</Text>
								<Pressable onPress={() => handleHeart()}>
									<Feather name="heart" size={25} color={heart ? "red" : "white"} style={styles.favorite} />
								</Pressable>
							</View>
						</View>
					</View>
				</ImageBackground>
				{season && (
					<View style={styles.season}>
						<Pressable style={styles.selectSeason} onPress={() => setModalSeasonVisible(true)}>
							<Text style={styles.selectSeasonTitle}>{selectedSeason}</Text>
							<Feather name="chevron-down" size={20} color={Colors.text} />
						</Pressable>
						{season
							.sort((a: any, b: any) => b.title.localeCompare(a.title))
							.map((item: any, i: number) => {
								if (selectedSeason === item.title)
									return (
										<View key={i}>
											{item.chapter &&
												item.chapter.map((item: any, key: number) => {
													return (
														<Link
															href={"/(content)/chapter"}
															key={key}
															style={[styles.chapter, { backgroundColor: chapterColor }]}
															asChild
														>
															<Pressable
																onPress={() => {
																	dispatch({ type: Actions.Links, payload: item });
																	if (isLoaded) show();
																}}
															>
																<Text style={styles.chapterTitle}>{item.title}</Text>
																<View style={styles.chapterIcons}>
																	<Feather name="chevron-right" size={25} color={Colors.text} />
																	<Pressable onPress={() => Linking.openURL(item.link[0])}>
																		<Feather name="download" size={25} color={Colors.text} />
																	</Pressable>
																</View>
															</Pressable>
														</Link>
													);
												})}
										</View>
									);
								return null;
							})}
					</View>
				)}
				{season === undefined && (
					<View style={{ marginHorizontal: Sizes.paddingHorizontal }}>
						<Pressable onPress={() => Linking.openURL(link[0])} style={[styles.movieLink, { backgroundColor: chapterColor }]}>
							<Feather name="download" size={20} color={Colors.text} />
							<Text style={styles.downloadMovie}>Descargar</Text>
						</Pressable>
						{link.length > 1 && (
							<View>
								<Text style={styles.moreOption}>Mas Opciones</Text>
								<Option data={link} />
							</View>
						)}
					</View>
				)}
				<CoverModal modalCoverVisible={modalCoverVisible} setModalCoverVisible={setModalCoverVisible} image={coverURL ?? cover?.asset.url} />
				{season && (
					<SeasonModal
						modalSeasonVisible={modalSeasonVisible}
						setModalSeasonVisible={setModalSeasonVisible}
						setSelectedSeason={setSelectedSeason}
						selectedSeason={selectedSeason}
						data={season.sort((a: any, b: any) => a.title.localeCompare(b.title))}
					/>
				)}
			</ScrollView>
		</View>
	);
};
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.background,
        paddingBottom: 70
	},
	background: {
		height: Sizes.windowHeight / 2.5,
		marginBottom: 20,
	},
	backgroundColor: {
		backgroundColor: "rgba(0,0,0,.6)",
		flex: 1,
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
	covermodal: {
		width: "35%",
		height: Sizes.windowHeight / 3.5,
	},
	cover: {
		height: "100%",
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
	selectSeason: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	selectSeasonTitle: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
	},
	seasonTitle: {
		color: Colors.text,
		marginBottom: 15,
		fontSize: Sizes.ajustFontSize(16),
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
		fontSize: Sizes.ajustFontSize(15),
	},
	chapterIcons: {
		flexDirection: "row",
		columnGap: 10,
	},
	movieLink: {
		borderRadius: 4,
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	downloadMovie: {
		color: Colors.text,
		marginLeft: 10,
		fontSize: Sizes.ajustFontSize(15),
	},
	moreOption: {
		fontSize: Sizes.ajustFontSize(15),
		color: Colors.text,
		marginBottom: 10,
	},
});

export default Item;
