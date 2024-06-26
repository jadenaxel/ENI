import Colors from "./Colors";
import LocalStorage from "./LocalStorage";

const Color: any = Colors;

export default {
	SERIES: "series",
	MOVIES: "movies",
	CATEGORIES: ["Animes", "Peliculas", "Series"],
	SchemeColor: {
		auto: "auto",
		light: "light",
		dark: "dark",
	},
	ColorType: (type: string, deviceColor: any, deviceColorState: any) =>
		deviceColorState === "auto" ? Color[deviceColor][type] : Color[deviceColorState][type],
	ColorTypeTwo: (type: string, deviceColor: any, deviceColorState: any) =>
		deviceColorState === "auto" ? Color[deviceColor === "light" ? "dark" : "light"][type] : Color[deviceColorState === "light" ? "dark" : "light"][type],
	StorageType: {
		DeviceColor: "deviceColor",
		PrincipalColor: "principalColor",
		TextColor: "textColor",
	},
	LoadColor: async function (setLoading: any, dispatch: any, Actions: any): Promise<void> {
		const DeviceColorS: any = await LocalStorage.getData(this.StorageType.DeviceColor);
		const PrincipalColorS: any = await LocalStorage.getData(this.StorageType.PrincipalColor);
		const TextColorS: any = await LocalStorage.getData(this.StorageType.TextColor);

		if (PrincipalColorS.length > 0 && PrincipalColorS !== null) dispatch({ type: Actions.PrincipalColor, payload: PrincipalColorS[0] });
		if (TextColorS.length > 0 && TextColorS !== null) dispatch({ type: Actions.TextColor, payload: TextColorS[0] });
		if (DeviceColorS.length > 0 && DeviceColorS !== null) dispatch({ type: Actions.DarkMode, payload: DeviceColorS[0] });

		setLoading(false);
	},
	Token: "skuKMUfkA9dNrFTq2QHufk1kTqx6Neh73xJ8htYSmiwgRE9NmbiCQ4PAs2xWn8rA7p5RKF9tG4GnA3e59PNbhXbe19AjKQImzo1EkDF5D3EkcuNwbnmc7L26lmXujl0cRrmb6nmUPRCXjduY6yi2KuJwbBMuIzwlA2ZONp1qsef5SDLXXaCW",
};
