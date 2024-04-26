export type Props = {
	uri: string;
	dispatch?: any;
	dispatchType?: any;
	load?: boolean;
	errors?: boolean;
};

export type Return = {
	data: any[];
	error: any[];
	isLoading: boolean;
};
