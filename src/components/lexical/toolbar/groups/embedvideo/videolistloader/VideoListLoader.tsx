import { useEffect } from "react";
import { Alert, AlertTitle, CircularProgress, Grid } from "@mui/material";
import useGetFromAPI from "src/hooks/useGetFromAPI";
import { VideoApiList } from "src/types";


interface IImageListLoaderProps {
    path: string;
    onVideoData: (loadedData: VideoApiList[]) => void;
}

export default function VideoListLoader({ path, onVideoData }: IImageListLoaderProps) {
    const { isLoading, data, error } = useGetFromAPI<VideoApiList[]>(path);

    //store server data after the first render
    //reset app data
    useEffect(() => {
        if (data) {
            onVideoData(data);
        }
    }, [data, onVideoData]);

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
