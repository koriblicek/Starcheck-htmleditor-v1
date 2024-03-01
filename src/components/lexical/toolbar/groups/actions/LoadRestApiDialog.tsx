import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { IAppInputData, ICON_SIZE, SaveRestApiPayload } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { useEffect } from 'react';
import useGetAxiosFunction from 'src/hooks/useGetAxiosFunction';

export interface ILoadRestApiDialogProps {
    open: boolean;
    onAction: (data: SaveRestApiPayload) => void;
    onClose: () => void;
    inputData: IAppInputData;
}
export function LoadRestApiDialog({ open, onAction, onClose, /*inputData*/ }: ILoadRestApiDialogProps) {
    const { isLoading, response, error, /*axiosFetch, */ cancelFetch } = useGetAxiosFunction<SaveRestApiPayload>();

    function load() {
        // axiosFetch(inputData.dataRestApiLink + inputData.dataDbKey);
    }

    useEffect(() => {
        if (response && error === null) {
            onAction(response);
            cancelFetch();
        }
    }, [response, error, cancelFetch, onAction]);

    function handleClose() {
        onClose();
        cancelFetch();
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Load content from Database
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}
                >
                    <Icon path={mdiWindowClose} size={ICON_SIZE} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container gap={1} justifyContent="center">
                    {isLoading
                        ?
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                        : error ?
                            <Grid item>
                                <Typography variant="body1">Error Code: {error?.code}</Typography>
                                <Typography variant="body1">Message: {error?.message}</Typography>
                                <Typography variant="body1">Url: {error?.url}</Typography>
                            </Grid>
                            : response ?
                                <></>
                                :
                                <Grid item>
                                    Are you sure you would like load content from database and overwrite existing content?
                                </Grid>
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                {error
                    ?
                    <Button
                        onClick={handleClose}
                        variant="text"
                        color="inherit"
                        size="small"
                    >
                        OK
                    </Button>
                    :
                    <>
                        <Button
                            onClick={handleClose}
                            variant="text"
                            color="inherit"
                            size="small"
                            disabled={isLoading}
                        >
                            Disagree
                        </Button>
                        <Button
                            onClick={() => load()}
                            disabled={isLoading}
                            variant="text"
                            color="error"
                            size="small"
                        >
                            Agree
                        </Button>
                    </>
                }
            </DialogActions>
        </Dialog>
    );
}