import type { FC } from "react";

import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import { Colors, Sizes } from "@/config";
import { Feather } from "@expo/vector-icons";

const WebSiteName: any = {
	"grantorrent.wtf": "Gran Torrent",
	"todotorrents.org": "Todo Torrent",
	"www.elitetorrent.com": "Elite Torrent",
	"www.alt-torrent.com": "Alt Torrent",
	"www.1337xx.to": "1337xx",
	"www.limetorrents.lol": "Lime Torrent",
	"idope.se": "Idope",
	"yts.homes": "YTS",
	"yts.rs": "YTS",
	"pelispanda.org": "Pelis Panda",
	"www.moviesdvdr.co": "Movies DVDR",
};

const Option: FC<any> = ({ data }: any): JSX.Element => {
	return (
		<View style={styles.optionContainer}>
			{data.map((item: any, i: number) => {
				const siteName: string = item.includes("magnet") ? "Magnet" : item.split("/")[2];

				return (
					<Pressable onPress={() => Linking.openURL(item)} key={i} style={styles.option}>
						<Text style={styles.optionText}>{WebSiteName[siteName] ?? siteName}</Text>
						<Feather name="download" size={15} color={Colors.background} />
					</Pressable>
				);
			})}
		</View>
	);
};
const styles = StyleSheet.create({
	optionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	option: {
		backgroundColor: Colors.Tint,
		padding: 15,
		borderRadius: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		gap: 10,
		width: "100%",
	},
	optionText: {
		color: Colors.background,
		textTransform: "capitalize",
		fontSize: Sizes.ajustFontSize(15),
	},
});

export default Option;
