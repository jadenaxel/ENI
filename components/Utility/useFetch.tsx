import type { Props, Return } from "@/config";

import { useEffect, useState } from "react";

const controller: AbortController = new AbortController();

const useFetch = (props: Props): Return => {
	const [data, setData] = useState<any>([]);
	const [error, setError] = useState<any>([false, "No Error"]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { uri, dispatch, dispatchType }: Props = props;

	const callData = async (): Promise<void> => {
		try {
			const request: Response = await fetch(uri, { signal: controller.signal });

			if (!request.ok && request.status !== 200) {
				const errorMessage = await request.text();
				setError([true, `Error ${request.status}: ${errorMessage}`]);
				setIsLoading(false);
				controller.abort();
			}
			const response: any = await request.json();
			setData(response.result);

			if (dispatch) dispatch({ type: dispatchType, payload: response.result });
			setIsLoading(false);
		} catch (error: any) {
			setError([true, error.message]);
			setIsLoading(false);
			controller.abort();
		}
	};

	useEffect(() => {
		callData();
	}, []);

	return { data, error, isLoading };
};

export default useFetch;
