import type { FC } from "react";

import { useContext, useEffect, useState } from "react";

import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Linking, Modal } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { Actions, Context } from "@/Wrapper";
import { Ads, Colors, Sizes, LocalStorage, Constants } from "@/config";
import { AdBanner, CoverModal, Loader, Option, SeasonModal } from "@/components";

import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.CHAPTER_LAST_HOME_INTERSTITIAL_V1;

const Item: FC = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { state, dispatch }: any = useContext(Context);
	const ItemData: any = state.SeriesItem;

	const [modalSeasonVisible, setModalSeasonVisible] = useState<boolean>(false);
	const [modalCoverVisible, setModalCoverVisible] = useState<boolean>(false);

	const [heart, setHeart] = useState<boolean>(false);
	const [selectedSeason, setSelectedSeason] = useState<string>(ItemData.season?.at(-1).title ?? "");

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { background, backgroundURL, cover, coverURL, year, title, description, season, categories, trailer, link } = ItemData;
	const chapterColor: string = background?.asset.metadata.palette.darkMuted.background ?? Colors.chapter;

	const contentType: string = season === null || season === undefined ? Constants.MOVIES : Constants.SERIES;

	const getStorageData = async (title: string) => {
		const contentData = await LocalStorage.getData(contentType, title);
		setHeart(contentData?.length > 0 ? true : false);
		setIsLoading(false);
	};

	const handleHeart = async () => {
		heart ? await LocalStorage.removeData(contentType, { title }) : await LocalStorage.saveData(contentType, { title });
		setHeart((prev: boolean): boolean => !prev);
	};

	useEffect(() => {
		getStorageData(title);
	}, []);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader />;

	return (
		<View style={styles.main}>
			<AdBanner ID={Ads.ITEM_SCREEN_BANNER_V1} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<ImageBackground source={{ uri: backgroundURL ?? background?.asset.url }} style={styles.background} blurRadius={6}>
					<View style={styles.backgroundColor}>
						<Pressable onPress={() => router.back()} style={styles.goBack}>
							<Feather name="x" size={25} color={"white"} />
						</Pressable>
						<Pressable onPress={() => setModalCoverVisible(true)} style={styles.cover}>
							<Image style={styles.coverImage} source={{ uri: coverURL ?? cover?.asset.url }} />
						</Pressable>
						<Text numberOfLines={1} style={styles.title}>
							{title}
						</Text>
						<Pressable onPress={() => handleHeart()} style={styles.heart}>
							<Feather name="heart" size={30} color={heart ? "red" : "white"} />
						</Pressable>
						<Text style={styles.description} numberOfLines={5}>
							{description}
						</Text>
						<ScrollView contentContainerStyle={styles.ccontent} horizontal showsHorizontalScrollIndicator={false}>
							{categories.map((category: any, i: number) => {
								return (
									<View key={i} style={styles.categories}>
										<Text style={styles.categoriesText}>{category.title}</Text>
									</View>
								);
							})}
						</ScrollView>
						<Text style={styles.year}>Año: {year ?? "-"}</Text>
						{trailer && (
							<Pressable style={styles.trailer} onPress={() => Linking.openURL(trailer)}>
								<Feather name="play" size={20} color={Colors.text} />
								<Text style={styles.trailerText}>Trailer</Text>
							</Pressable>
						)}
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
								if (selectedSeason !== item.title) return null;
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
		paddingBottom: 70,
	},
	background: {
		marginBottom: 20,
	},
	backgroundColor: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,.6)",
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 20,
	},
	goBack: {
		marginTop: 30,
		marginBottom: 10,
	},
	cover: {
		alignItems: "center",
		marginBottom: 20,
	},
	coverImage: {
		width: Sizes.windowWidth / 3,
		height: Sizes.windowHeight / 3.5,
		borderRadius: 4,
	},
	title: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(20),
		textAlign: "center",
		marginBottom: 10,
	},
	heart: {
		alignItems: "center",
		marginBottom: 10,
	},
	description: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		textAlign: "justify",
		marginBottom: 10,
	},

	ccontent: {
		gap: 10,
		marginBottom: 10,
	},
	categories: {
		backgroundColor: Colors.chapter,
		borderRadius: 4,
		padding: 10,
	},
	categoriesText: {
		color: Colors.text,
	},
	year: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
		marginBottom: 10,
	},
	trailer: {
		backgroundColor: Colors.chapter,
		height: 40,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		flexDirection: "row",
	},
	trailerText: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(16),
	},
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
