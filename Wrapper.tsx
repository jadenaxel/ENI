import type { FC } from "react";

// Importing necessary components from react
import { createContext, useReducer } from "react";
import { Colors } from "./config";

// Initializing values to state
const initialValue: any = {
	// store: "Jaden Smith",
	store: "123show",
	Data: "",
	SeriesItem: "",
	Links: "",
	Categories: "",
	BannerAd: "Load",
	colorOne: Colors.Tint,
	textColor: Colors.text,
};

//  Creating actions names and exporting them
export const Actions: any = {
	Store: "Store",
	All: "All",
	SeriesItem: "Series Item",
	Links: "Links",
	Categories: "Categories",
	BannerAd: "BannerAd",
	PrincipalColor: "Principal Color",
	TextColor: "Text Color",
};

// Reducer function
// Reducing values to make sure they only recieve a specific value
const reducer = (state: any, action: any): any => {
	switch (action.type) {
		case Actions.Store:
			return { ...state, store: action.payload };
		case Actions.All:
			return { ...state, Data: action.payload };
		case Actions.SeriesItem:
			return { ...state, SeriesItem: action.payload };
		case Actions.Links:
			return { ...state, Links: action.payload };
		case Actions.Categories:
			return { ...state, Categories: action.payload };
		case Actions.BannerAd:
			return { ...state, BannerAd: action.payload };
		case Actions.PrincipalColor:
			return { ...state, colorOne: action.payload };
		case Actions.TextColor:
			return { ...state, textColor: action.payload };
		default:
			return state;
	}
};

// Exporting the context
export const Context: any = createContext({});

// Wrapper component
const Wrapper: FC<any> = ({ children }: any): JSX.Element => {
	// Setting the state and dispatcher up with the initial state and the reducer.
	const [state, dispatch] = useReducer(reducer, initialValue);

	return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export default Wrapper;
