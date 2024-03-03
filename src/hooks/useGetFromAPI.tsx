import { useEffect, useReducer } from 'react';
import { IErrorObject } from '../types';
import axios, { AxiosError } from 'axios';

type State<T> = {
    isLoading: boolean;
    error: IErrorObject | null;
    data: T | null;
};

type Action<T> =
    | { type: "GET_INIT"; }
    | { type: "GET_SUCCESS"; payload: T; }
    | { type: "GET_FAILURE"; payload: IErrorObject; }
    | { type: "GET_NO_PATH"; };

type Reducer<T> = (state: State<T>, action: Action<T>) => State<T>;

const initialState = {
    isLoading: false,
    error: null,
    data: null,
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        case "GET_INIT":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "GET_SUCCESS":
            return {
                ...state,
                isLoading: false,
                data: action.payload,
                error: null,
            };
        case "GET_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case "GET_NO_PATH":
            return {
                ...state,
                error: { code: "URL ERROR", codeText: "No URL provided", url: "undefined" },
            };
        default:
            throw new Error("Unhandled action type!");
    }
}

/**
 * Hook to GET data through REST Api
 * 
 * @param url Request url
 * @returns [ isLoading:boolean, data: T | null, error: IErrorObject | null]
 */
function useGetFromAPI<T>(url: string) {
    const [state, dispatch] = useReducer<Reducer<T>>(reducer, initialState);

    useEffect(() => {
        const getData = () => {
            if (url) {
                dispatch({ type: "GET_INIT" });
                axios
                    .get(url)
                    .then((response) => {
                        dispatch({ type: "GET_SUCCESS", payload: response.data });
                    })
                    .catch((error: AxiosError) => {
                        dispatch({ type: "GET_FAILURE", payload: { code: error.code ? error.code : "n/a", codeText: error.message, url: url } });
                    });
            } else {
                dispatch({ type: "GET_NO_PATH" });
            }
        };
        getData();
    }, [url]);

    return state;
}

export default useGetFromAPI;