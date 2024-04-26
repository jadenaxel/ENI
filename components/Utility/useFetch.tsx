import type { Props, Return } from "@/config";

import { useEffect, useState } from "react";

const controller: AbortController = new AbortController();

const useFetch = (props: Props): Return => {
	const { uri, dispatch, dispatchType, load = true, errors = true }: Props = props;

	const [data, setData] = useState<any>([]);
	const [error, setError] = useState<any>([false, "No Error"]);
	const [isLoading, setIsLoading] = useState<boolean>(load);

	const callData = async (): Promise<void> => {
		try {
			const request: Response = await fetch(uri, { signal: controller.signal });

			if (!request.ok && request.status !== 200) {
				const errorMessage = await request.text();
				errors && setError([true, `Error ${request.status}: ${errorMessage}`]);
				load && setIsLoading(false);
				controller.abort();
			}
			const response: any = await request.json();
			setData(response.result);

			if (dispatch) dispatch({ type: dispatchType, payload: response.result });
			load && setIsLoading(false);
		} catch (error: any) {
			errors && setError([true, error.message]);
			load && setIsLoading(false);
			controller.abort();
		}
	};

	useEffect(() => {
		callData();
	}, []);

	return { data, error, isLoading };
};

export default useFetch;
