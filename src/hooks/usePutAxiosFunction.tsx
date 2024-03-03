import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

export interface IPutErrorObj {
    code: number;
    message: string;
    url: string;
}

function usePutAxiosFunction<T>() {
    const [error, setError] = useState<IPutErrorObj | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [controller, setController] = useState<AbortController>();

    const axiosPut = useCallback(async (url: string, data: T, params?: AxiosRequestConfig) => {
        try {
            setIsUploading(true);
            setError(null);
            setIsCompleted(false);
            const ctrl = new AbortController();
            setController(ctrl);

            await axios.put(url, data, {
                ...params,
                signal: ctrl.signal
            });

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
            setIsUploading(false);
            setIsCompleted(true);
        }
    }, []);

    const cancelPut = useCallback(() => {
        setError(null);
        setIsUploading(false);
        setIsCompleted(false);
        controller && controller.abort();
    }, [controller]);

    useEffect(() => {
        //useEffect cleanup function
        return () => {
            controller && controller.abort();
        };
    }, [controller]);

    return { error, isUploading, isCompleted, axiosPut, cancelPut };
}

export default usePutAxiosFunction;