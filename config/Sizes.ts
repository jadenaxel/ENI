import { Dimensions, PixelRatio } from "react-native";

export default {
	windowWidth: Dimensions.get("window").width,
	windowHeight: Dimensions.get("window").height,
	deviceFontScale: PixelRatio.getFontScale(),
	ajustFontSize: (px: number = 12) => px / PixelRatio.getFontScale(),

	paddingHorizontal: 16,
};
