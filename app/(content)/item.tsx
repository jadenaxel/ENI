import type { FC } from "react";
import type { ColorSchemeName } from "react-native";

import { Fragment, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Pressable, ScrollView, Linking, useColorScheme } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { Picker } from "@react-native-picker/picker";

import { Actions, Context } from "@/Wrapper";
import { Ads, Colors, Sizes, LocalStorage, Constants } from "@/config";
import { CoverModal, Loader, Option, SeasonModal } from "@/components";

const AD_STRING: string = __DEV__ ? TestIds.INTERSTITIAL : Ads.CHAPTER_LAST_HOME_INTERSTITIAL_V1;

const Item: FC = (): JSX.Element => {
	const { state, dispatch }: any = useContext(Context);
	const { SeriesItem, store, colorOne, darkMode, textColor } = state;

	const ItemData: any = SeriesItem.item;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [modalSeasonVisible, setModalSeasonVisible] = useState<boolean>(false);
	const [modalCoverVisible, setModalCoverVisible] = useState<boolean>(false);
	const [heart, setHeart] = useState<boolean>(false);
	const [selectedSeason, setSelectedSeason] = useState<string>(ItemData.season?.at(-1).title ?? "");
	const [order, setOrder] = useState<string>("Nombre");

	const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_STRING);

	const { _id, backgroundURL, coverURL, year, title, description, season, categories, trailer, watches, links } = ItemData;

	const contentType: string = season === null || season === undefined ? Constants.MOVIES : Constants.SERIES;

	const done: boolean = store === "123show";

	const deviceColor: ColorSchemeName = useColorScheme();
	const DarkModeType: string | ColorSchemeName = darkMode === "auto" ? deviceColor : darkMode;

	const getStorageData = async (item: any) => {
		const contentData = await LocalStorage.getData(contentType, item);
		setHeart(contentData?.length > 0);
	};

	const handleHeart = async () => {
		heart ? await LocalStorage.removeData(contentType, _id) : await LocalStorage.saveData(contentType, { _id });
		setHeart((prev: boolean): boolean => !prev);
	};

	const REPORT_MOVIE: string = `mailto:jondydiaz07@gmail.com?subject="Reportar Pelicula"&body="La Pelicula ${title} tiene problema"`;

	useEffect(() => {
		getStorageData(_id);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		load();
	}, [load, isClosed]);

	if (isLoading) return <Loader deviceColor={deviceColor} DarkModeType={DarkModeType} />;

	return (
		<View style={[styles.main, { backgroundColor: Constants.ColorType("background", deviceColor, DarkModeType) }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<ImageBackground source={{ uri: backgroundURL }} style={styles.background} blurRadius={6}>
					<View style={styles.backgroundColor}>
						<Pressable onPress={() => setModalCoverVisible(true)} style={styles.cover}>
							<Image style={styles.coverImage} source={{ uri: coverURL }} />
						</Pressable>
						<Text style={styles.title}>{title}</Text>
						<Pressable onPress={() => handleHeart()} style={styles.heart}>
							<Feather name="heart" size={30} color={heart ? "red" : "white"} />
						</Pressable>
						<Text style={[styles.description, styles.text]} numberOfLines={6}>
							{description}
						</Text>
						<View style={styles.ccontent}>
							{categories.map((category: any, i: number) => {
								if (Constants.CATEGORIES.includes(category.title)) return null;

								return (
									<Link href={"/(search)/categories"} key={i} asChild>
										<Pressable
											onPress={() => {
												dispatch({ type: Actions.Categories, payload: category });
												if (isLoaded) show();
											}}
										>
											<View style={[styles.categories, { backgroundColor: colorOne }]}>
												<Text style={[styles.categoriesText, { color: textColor }]}>{category.title}</Text>
											</View>
										</Pressable>
									</Link>
								);
							})}
						</View>
						<Text style={[styles.year, styles.text]}>Año: {year ?? "-"}</Text>
						{trailer && (
							<Pressable style={[styles.trailer, { backgroundColor: colorOne }]} onPress={() => Linking.openURL(trailer)}>
								<Feather name="play" size={20} color={textColor} />
								<Text style={[styles.trailerText, { color: textColor }]}>Trailer</Text>
							</Pressable>
						)}
					</View>
				</ImageBackground>
				{season && done && (
					<View style={styles.season}>
						<View style={styles.seasonOption}>
							<Pressable style={styles.selectSeason} onPress={() => season.length > 1 && setModalSeasonVisible(true)}>
								<Text style={[styles.text, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>{selectedSeason}</Text>
								{season.length > 1 && <Feather name="chevron-down" size={20} color={Constants.ColorType("text", deviceColor, DarkModeType)} />}
							</Pressable>
							<Pressable style={{ width: "10%" }}>
								<Picker selectedValue={order} dropdownIconColor={colorOne} onValueChange={(itemValue: any) => setOrder(itemValue)}>
									<Picker.Item label="Nombre" value="name" />
									<Picker.Item label="Salida" value="salida" />
								</Picker>
							</Pressable>
						</View>
						{season
							.sort((a: any, b: any) => b.title.localeCompare(a.title))
							.map((item: any, i: number) => {
								if (selectedSeason !== item.title) return null;
								return (
									<Fragment key={i}>
										{item.chapter &&
											item.chapter
												.sort((a: any, b: any) => (order === "name" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)))
												.map((chapter: any, key: number) => {
													return (
														<Link
															href={"/(content)/chapter"}
															key={key}
															style={[styles.chapter, { backgroundColor: colorOne }]}
															asChild
														>
															<Pressable
																onPress={() => {
																	dispatch({
																		type: Actions.Links,
																		payload: { item: { ...chapter }, contentTitle: title },
																	});
																	if (isLoaded) show();
																}}
															>
																<Text style={[styles.chapterTitle, { color: textColor }]}>{chapter.title}</Text>
																<View style={styles.chapterIcons}>
																	<Feather name="chevron-right" size={25} color={textColor} />
																	<Pressable onPress={() => Linking.openURL(chapter.links[0].link)}>
																		<Feather name="download" size={25} color={textColor} />
																	</Pressable>
																</View>
															</Pressable>
														</Link>
													);
												})}
									</Fragment>
								);
							})}
					</View>
				)}
				{season === undefined && done && (
					<View style={{ marginHorizontal: Sizes.paddingHorizontal }}>
						{watches && (
							<Link href={"/(content)/chapter"} asChild style={[styles.movieButton, { backgroundColor: colorOne }]}>
								<Pressable
									onPress={() => {
										dispatch({ type: Actions.Links, payload: { item: ItemData, contentTitle: title } });
										if (isLoaded) show();
									}}
								>
									<Feather name="play" size={20} color={textColor} />
									<Text style={[styles.movieButtonText, { color: textColor }]}>Ver</Text>
								</Pressable>
							</Link>
						)}
						<Pressable onPress={() => (links ? Linking.openURL(links[0].link) : null)} style={[styles.movieButton, { backgroundColor: colorOne }]}>
							<Feather name="download" size={20} color={textColor} />
							<Text style={[styles.movieButtonText, { color: textColor }]}>Descargar</Text>
						</Pressable>
						{links !== null && links?.hasOwnProperty("link") && (
							<View>
								<Text style={[styles.moreOption, styles.text, { color: Constants.ColorType("text", deviceColor, DarkModeType) }]}>
									Mas Opciones
								</Text>
								<Option data={links?.slice(1)} deviceColor={deviceColor} DarkModeType={DarkModeType} />
							</View>
						)}
						<Pressable onPress={() => Linking.openURL(REPORT_MOVIE)} style={[styles.movieButton, { backgroundColor: colorOne }]}>
							<Feather name="mail" size={20} color={textColor} />
							<Text style={[styles.movieButtonText, { color: textColor }]}>Reportar</Text>
						</Pressable>
					</View>
				)}
				<CoverModal modalCoverVisible={modalCoverVisible} setModalCoverVisible={setModalCoverVisible} image={coverURL} />
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
		height: Sizes.windowHeight,
	},
	backgroundColor: {
		height: Sizes.windowHeight,
		backgroundColor: "rgba(0,0,0,.6)",
		paddingHorizontal: Sizes.paddingHorizontal,
		paddingBottom: 20,
		justifyContent: "center",
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
		marginBottom: 20,
	},
	heart: {
		alignItems: "center",
		marginBottom: 20,
	},
	description: {
		textAlign: "justify",
		marginBottom: 20,
	},
	ccontent: {
		flexDirection: "row",
		gap: 5,
		marginBottom: 20,
		flexWrap: "wrap",
		justifyContent: "center",
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
		textAlign: "center",
		marginBottom: 20,
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
