import { Alert, AlertTitle, Grid, LinearProgress, Typography } from "@mui/material";
import { IAppData, IAppInputData } from "./types";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { htmlEditorAppDataActions } from "./store/htmleditor-data/htmlEditorAppDataSlice";
import useGetFromAPI from "./hooks/useGetFromAPI";
import AppCssLoader from "./AppCssLoader";

interface IAppProps {
  inputData: IAppInputData;
}

export default function AppDataLoader({ inputData }: IAppProps) {
  const dispatch = useDispatch();

  const { error, data, isLoading } = useGetFromAPI<IAppData>(inputData.dataApiLink + inputData.dataId + "/" + inputData.dataModule + "/" + inputData.dataVersion + "/settings");
  //const { error, data } = useGetFromAPI<IAppData>("http://localhost:5000/settings");

  const [proceed, setProceed] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      //initialize loaded data
      dispatch(htmlEditorAppDataActions.initializeAppData({ data }));
      setProceed(true);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, dispatch, inputData]);

  return (
    <Fragment>
      {proceed && <AppCssLoader inputData={inputData} />}
      {isLoading &&
        <Grid container p={1}>
          <Grid item xs textAlign='center'>
            <Typography>Loading API settings...</Typography>
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