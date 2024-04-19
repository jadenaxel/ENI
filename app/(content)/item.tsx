import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Linking, useColorScheme } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import Sheet from "react-native-raw-bottom-sheet";

import { Actions, Context } from "@/Wrapper";
import { Ads, Colors, Sizes, LocalStorage, Constants } from "@/config";
import { AdBanner, CoverModal, Loader, Option, SeasonModal } from "@/components";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.CHAPTER_LAST_HOME_INTERSTITIAL_V1;

const Item: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);
	const ItemData: any = state.SeriesItem.item;
	const sensible: string = state.SeriesItem.appstore;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [modalSeasonVisible, setModalSeasonVisible] = useState<boolean>(false);
	const [modalCoverVisible, setModalCoverVisible] = useState<boolean>(false);
	const [heart, setHeart] = useState<boolean>(false);
	const [selectedSeason, setSelectedSeason] = useState<string>(ItemData.season?.at(-1).title ?? "");
	const [selectedSort, setSelectedSort] = useState<string>("Name");

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { background, backgroundURL, cover, coverURL, year, title, description, season, categories, trailer, watch, link } = ItemData;

	const contentType: string = season === null || season === undefined ? Constants.MOVIES : Constants.SERIES;

	const done: boolean = sensible === "123show" ? true : false;
	const CanLoad: boolean = state.BannerAd === "Load";

	const sortOrder: any = useRef();

	const PrincipalColor: string = state.colorOne;
	const TextColor: string = state.textColor;

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkMode: string = state.darkMode;
	const DarkModeType: string | ColorSchemeName = DarkMode === "auto" ? deviceColor : DarkMode;

	const getStorageData = async (title: string) => {
		const contentData = await LocalStorage.getData(contentType, title);
		setHeart(contentData?.length > 0 ? true : false);
	};

	const handleHeart = async () => {
		heart ? await LocalStorage.removeData(contentType, { title }) : await LocalStorage.saveData(contentType, { title });
		setHeart((prev: boolean): boolean => !prev);
	};

	const REPORT_MOVIE: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Pelicula"&body="La Pelicula ${title} tiene problema"`;

	useEffect(() => {
		getStorageData(title);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<View
			style={[
				styles.main,
				{ backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) },
				CanLoad && !Constants.IsDev && { paddingBottom: 70 },
			]}
		>
			{!Constants.IsDev && <AdBanner ID={Ads.ITEM_SCREEN_BANNER_V1} />}
			<ScrollView showsVerticalScrollIndicator={false}>
				<ImageBackground source={{ uri: backgroundURL ?? background?.asset.url }} style={styles.background} blurRadius={6}>
					<View style={styles.backgroundColor}>
						<Pressable onPress={() => setModalCoverVisible(true)} style={styles.cover}>
							<Image style={styles.coverImage} source={{ uri: coverURL ?? cover?.asset.url }} />
						</Pressable>
						<Text style={styles.title}>{title}</Text>
						<Pressable onPress={() => handleHeart()} style={styles.heart}>
							<Feather name="heart" size={30} color={heart ? "red" : "white"} />
						</Pressable>
						<Text style={[styles.description, styles.text]} numberOfLines={5}>
							{description}
						</Text>
						<ScrollView contentContainerStyle={styles.ccontent} horizontal showsHorizontalScrollIndicator={false}>
							{categories.map((category: any, i: number) => {
								if (Constants.CATEGORIES.includes(category.title)) return null;

								return (
									<Link href={"/(search)/categories"} key={i} asChild>
										<Pressable
											onPress={() => {
												dispatch({ type: Actions.Categories, payload: category });
												if (isLoaded && !Constants.IsDev) show();
											}}
										>
											<View style={[styles.categories, { backgroundColor: PrincipalColor }]}>
												<Text style={[styles.categoriesText, { color: TextColor }]}>{category.title}</Text>
											</View>
										</Pressable>
									</Link>
								);
							})}
						</ScrollView>
						<Text style={[styles.year, styles.text]}>Año: {year ?? "-"}</Text>
						{trailer && (
							<Pressable style={[styles.trailer, { backgroundColor: PrincipalColor }]} onPress={() => Linking.openURL(trailer)}>
								<Feather name="play" size={20} color={TextColor} />
								<Text style={[styles.trailerText, { color: TextColor }]}>Trailer</Text>
							</Pressable>
						)}
					</View>
				</ImageBackground>
				{season && done && (
					<View style={styles.season}>
						<View style={styles.seasonOption}>
							<Pressable style={styles.selectSeason} onPress={() => setModalSeasonVisible(true)}>
								<Text style={[styles.text, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{selectedSeason}</Text>
								<Feather name="chevron-down" size={20} color={Constants.ColorType("text", deviceColor, DarkModeType)} />
							</Pressable>
							<Pressable onPress={() => sortOrder.current.open()}>
								<Text style={[styles.text, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>Ordenar</Text>
							</Pressable>
						</View>
						{season
							.sort((a: any, b: any) => b.title.localeCompare(a.title))
							.map((item: any, i: number) => {
								if (selectedSeason !== item.title) return null;
								return (
									<View key={i}>
										{item.chapter &&
											item.chapter
												.sort((a: any, b: any) =>
													selectedSort === "Name" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
												)
												.map((chapter: any, key: number) => {
													return (
														<Link
															href={"/(content)/chapter"}
															key={key}
															style={[styles.chapter, { backgroundColor: PrincipalColor }]}
															asChild
														>
															<Pressable
																onPress={() => {
																	dispatch({
																		type: Actions.Links,
																		payload: { item: { ...chapter }, contentTitle: title },
																	});
																	if (isLoaded && !Constants.IsDev) show();
																}}
															>
																<Text style={[styles.chapterTitle, { color: TextColor }]}>{chapter.title}</Text>
																<View style={styles.chapterIcons}>
																	<Feather name="chevron-right" size={25} color={TextColor} />
																	<Pressable onPress={() => Linking.openURL(chapter.link[0])}>
																		<Feather name="download" size={25} color={TextColor} />
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
				{season === undefined && done && (
					<View style={{ marginHorizontal: Sizes.paddingHorizontal }}>
						{watch && (
							<Link href={"/(content)/chapter"} asChild style={[styles.movieButton, { backgroundColor: PrincipalColor }]}>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.Links, payload: { item: ItemData, contentTitle: title } });
										if (isLoaded && !Constants.IsDev) show();
									}}
								>
									<Feather name="play" size={20} color={TextColor} />
									<Text style={[styles.movieButtonText, { color: TextColor }]}>Ver</Text>
								</Pressable>
							</Link>
						)}
						<Pressable onPress={() => Linking.openURL(link[0])} style={[styles.movieButton, { backgroundColor: PrincipalColor }]}>
							<Feather name="download" size={20} color={TextColor} />
							<Text style={[styles.movieButtonText, { color: TextColor }]}>Descargar</Text>
						</Pressable>
						{link.length > 1 && (
							<View>
								<Text style={[styles.moreOption, styles.text]}>Mas Opciones</Text>
								<Option data={link.slice(1)} />
							</View>
						)}
						<Pressable onPress={() => Linking.openURL(REPORT_MOVIE)} style={[styles.movieButton, { backgroundColor: PrincipalColor }]}>
							<Feather name="mail" size={20} color={TextColor} />
							<Text style={[styles.movieButtonText, { color: TextColor }]}>Reportar</Text>
						</Pressable>
					</View>
				)}
				<CoverModal modalCoverVisible={modalCoverVisible} setModalCoverVisible={setModalCoverVisible} image={coverURL ?? cover?.asset.url} />
				{season && done && (
					<SeasonModal
						modalSeasonVisible={modalSeasonVisible}
						setModalSeasonVisible={setModalSeasonVisible}
						setSelectedSeason={setSelectedSeason}
						selectedSeason={selectedSeason}
						data={season.sort((a: any, b: any) => a.title.localeCompare(b.title))}
					/>
				)}
			</ScrollView>
			<Sheet customStyles={{ container: styles.sortOrder }} height={Sizes.windowHeight / 4} openDuration={250} ref={sortOrder}>
				<View style={styles.sheetHeader}>
					<Text style={styles.text}>Ordernar Por:</Text>
				</View>
				<View style={styles.sheetOption}>
					<Pressable
						style={styles.sheetOptionName}
						onPress={() => {
							setSelectedSort("Name");
							sortOrder.current.close();
						}}
					>
						<Text style={styles.text}>Nombre</Text>
						{selectedSort === "Name" && <Feather name="check" color={Colors.text} size={20} />}
					</Pressable>
					<Pressable
						style={styles.sheetOptionS}
						onPress={() => {
							setSelectedSort("Salida");
							sortOrder.current.close();
						}}
					>
						<Text style={styles.text}>Salida</Text>
						{selectedSort !== "Name" && <Feather name="check" color={Colors.text} size={20} />}
					</Pressable>
				</View>
			</Sheet>
		</View>
	);
};
const styles = StyleSheet.create({
	// Constants
	text: {
		color: Colors.text,
		fontSize: Sizes.ajustFontSize(15),
	},
	// Constants

	main: {
		flex: 1,
		backgroundColor: Colors.background,
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
	cover: {
		alignItems: "center",
		marginBottom: 20,
		marginTop: 60,
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
		fontSize: Sizes.ajustFontSize(13),
	},
	year: {
		marginBottom: 10,
	},
	trailer: {
		height: 40,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		flexDirection: "row",
	},
	trailerText: {
		fontSize: Sizes.ajustFontSize(16),
	},
	season: {
		paddingHorizontal: Sizes.paddingHorizontal,
	},
	seasonOption: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
		justifyContent: "space-between",
	},
	selectSeason: {
		flexDirection: "row",
		alignItems: "center",
	},
	sortOrder: {
		backgroundColor: Colors.background,
	},
	sheetHeader: {
		borderBottomWidth: 1,
		borderBottomColor: "#efefef",
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingVertical: 14,
		marginBottom: 20,
	},
	sheetOption: {
		marginBottom: 20,
	},
	sheetOptionName: {
		flexDirection: "row",
		justifyContent: "space-between",

		borderBottomColor: Colors.text,
		borderBottomWidth: 1,
		marginBottom: 10,
		marginHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 10,
	},
	sheetOptionS: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: Sizes.paddingHorizontal,
	},
	chapter: {
		borderRadius: 4,
		padding: 10,
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	chapterTitle: {
		fontSize: Sizes.ajustFontSize(15),
	},
	chapterIcons: {
		flexDirection: "row",
		columnGap: 10,
	},
	movieButton: {
		borderRadius: 4,
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	movieButtonText: {
		marginLeft: 10,
		fontSize: Sizes.ajustFontSize(15),
	},
	moreOption: {
		marginBottom: 10,
	},
});

export default Item;
