import { Alert, AlertTitle, Grid, LinearProgress, Typography } from "@mui/material";
import { IAppInputData, ImageDataType } from "./types";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./store/hooks";
import { htmlEditorAppDataActions } from "./store/htmleditor-data/htmlEditorAppDataSlice";
import useGetFromAPI from "./hooks/useGetFromAPI";
import AppVideosLoader from "./AppVideosLoader";

interface IAppImagesLoaderProps {
  inputData: IAppInputData;
}

export default function AppImagesLoader({ inputData }: IAppImagesLoaderProps) {
  const dispatch = useDispatch();

  const { appData } = useAppSelector(state => state.htmlEditorAppData);

  const { error, data, isLoading } = useGetFromAPI<ImageDataType>(appData.imagesURL);

  const [proceed, setProceed] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      //initialize loaded data
      dispatch(htmlEditorAppDataActions.initializeImageData({ data }));
      setProceed(true);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, dispatch]);

  return (
    <Fragment>
      {proceed && <AppVideosLoader inputData={inputData} />}
      {isLoading &&
        <Grid container p={1}>
          <Grid item xs textAlign='center'>
            <Typography>Loading images...</Typography>
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