import { Alert, AlertTitle, Grid, LinearProgress, Typography } from "@mui/material";
import { IAppInputData, VideoDataType } from "./types";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { htmlEditorAppDataActions } from "./store/htmleditor-data/htmlEditorAppDataSlice";
import { useAppSelector } from "./store/hooks";
import useGetFromAPI from "./hooks/useGetFromAPI";
import App from "./App";

interface IAppVideosLoaderProps {
  inputData: IAppInputData;
}

export default function AppVideosLoader({ inputData }: IAppVideosLoaderProps) {
  const dispatch = useDispatch();

  const { appData } = useAppSelector(state => state.htmlEditorAppData);

  const { error, data, isLoading } = useGetFromAPI<VideoDataType>(appData.videosURL);

  const [proceed, setProceed] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      //initialize loaded data
      dispatch(htmlEditorAppDataActions.initializeVideoData({ data }));
      setProceed(true);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, dispatch]);

  return (
    <Fragment>
      {proceed && <App inputData={inputData} />}
      {isLoading &&
        <Grid container p={1}>
          <Grid item xs textAlign='center'>
            <Typography>Loading videos...</Typography>
            <LinearProgress />
          </Grid>
        </Grid>
      }
      {
        error &&
        <Alert variant="standard" color="error">
          <AlertTitle>{error.code}</AlertTitle>
          <Typography variant="body1">{error.codeText}</Typography>
          <Typography variant="subtitle1">{error.url}</Typography>
        </Alert>
      }
    </Fragment>
  );
}