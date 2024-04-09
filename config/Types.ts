export type Props = {
	uri: string;
	dispatch?: any;
	dispatchType?: any;
};

export type Return = {
	data: any[];
	error: any[];
	isLoading: boolean;
};
