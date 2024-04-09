import type { FC } from "react";

// Importing necessary components from react
import { createContext, useReducer } from "react";

// Initializing values to state
const initialValue: any = {
	Data: "",
	SeriesItem: "",
};

//  Creating actions names and exporting them
export const Actions: any = {
	All: "All",
	SeriesItem: "Series Item",
};

// Reducer function
// Reducing values to make sure they only recieve a specific value
const reducer = (state: any, action: any): any => {
	switch (action.type) {
		case Actions.All:
			return { ...state, Data: action.payload };
		case Actions.SeriesItem:
			return { ...state, SeriesItem: action.payload };
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
