import { Alert, AlertTitle, Grid, LinearProgress, Typography } from "@mui/material";
import { IAppInputData, ICssData } from "./types";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { htmlEditorAppDataActions } from "./store/htmleditor-data/htmlEditorAppDataSlice";
import { useAppSelector } from "./store/hooks";
import useGetFromAPI from "./hooks/useGetFromAPI";
import AppImagesLoader from "./AppImagesLoader";

interface IAppCssLoaderProps {
  inputData: IAppInputData;
}

export default function AppCssLoader({ inputData }: IAppCssLoaderProps) {
  const dispatch = useDispatch();

  const { appData } = useAppSelector(state => state.htmlEditorAppData);

  const { error, data, isLoading } = useGetFromAPI<ICssData>(appData.cssURL);

  const [proceed, setProceed] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      //initialize loaded data
      dispatch(htmlEditorAppDataActions.initializeCssData({ data }));
      setProceed(true);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, dispatch]);

  return (
    <Fragment>
      {proceed && <AppImagesLoader inputData={inputData} />}
      {isLoading &&
        <Grid container p={1}>
          <Grid item xs textAlign='center'>
            <Typography>Loading css classes...</Typography>
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