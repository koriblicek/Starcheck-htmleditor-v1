import { useEffect } from "react";
import { Alert, AlertTitle, CircularProgress, Grid } from "@mui/material";
import useGetFromAPI from "src/hooks/useGetFromAPI";


interface IImageListLoaderProps {
    path: string;
    onImageData: (loadedData: string[]) => void;
}

export default function ImageListLoader({ path, onImageData }: IImageListLoaderProps) {
    const { isLoading, data, error } = useGetFromAPI<string[]>(path);

    //store server data after the first render
    //reset app data
    useEffect(() => {
        if (data) {
            onImageData(data);
        }
    }, [data, onImageData]);

    return (
        <>
            {isLoading &&
                <Grid container p={1}>
                    <Grid item xs textAlign='center'>
                        <CircularProgress />
                    </Grid>
                </Grid>
            }
            {error &&
                <Grid container p={1} >
                    <Grid item xs>
                        <Alert variant='standard' severity='error'>
                            <AlertTitle>{error.code}</AlertTitle>
                            {error.codeText}
                        </Alert>
                    </Grid>
                </Grid>
            }
        </>
    );
}
