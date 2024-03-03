import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

export interface IGetErrorObj {
    code: number;
    message: string;
    url: string;
}

function useGetAxiosFunction<T>() {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<IGetErrorObj | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [controller, setController] = useState<AbortController>();

    const axiosFetch = useCallback(async (url: string, params?: AxiosRequestConfig) => {
        try {
            setIsLoading(true);
            setError(null);
            setResponse(null);

            const ctrl = new AbortController();
            setController(ctrl);

            const res = await axios.get(url, {
                ...params,
                signal: ctrl.signal
            });

            setResponse(res.data as T);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("cancel");
                setError(null);
            } else {
                if (err instanceof AxiosError) {
                    setError({
                        message: err.response?.data.message || "Server Unavailable",
                        code: err.response?.status || 503,
                        url
                    });
                }
                if (err instanceof Error) {
                    setError({
                        message: err.message,
                        code: 500,
                        url
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelFetch = useCallback(() => {
        setError(null);
        setIsLoading(false);
        setResponse(null);
        controller && controller.abort();
    }, [controller]);

    useEffect(() => {
        //useEffect cleanup function
        return () => {
            controller && controller.abort();
        };
    }, [controller]);

    return { response, error, isLoading, axiosFetch, cancelFetch };
}

export default useGetAxiosFunction;