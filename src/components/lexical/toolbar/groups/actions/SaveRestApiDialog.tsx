import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { /*IAppInputData, */ICON_SIZE, SaveRestApiPayload } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import usePutAxiosFunction from 'src/hooks/usePutAxiosFunction';
import { useEffect } from 'react';

export interface ISaveRestApiDialogProps {
    open: boolean;
    // inputData: IAppInputData;
    onClose: () => void;
    data: SaveRestApiPayload | null;
}
export function SaveRestApiDialog({ open, data, onClose/*, inputData*/ }: ISaveRestApiDialogProps) {
    const { isUploading, isCompleted, error, /*axiosPut,*/ cancelPut } = usePutAxiosFunction<SaveRestApiPayload>();

    function save() {
        if (data !== null) {
            // axiosPut(inputData.dataRestApiLink + inputData.dataDbKey, data,);
        }
    }

    useEffect(() => {
        if (isCompleted && error === null) {
            onClose();
            cancelPut();
        }
    }, [isCompleted, error, cancelPut, onClose]);

    function handleClose() {
        cancelPut();
        onClose();
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Save content to Database
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
                    {isUploading
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
                            : isCompleted ?
                                <></>
                                :
                                <Grid item>
                                    Are you sure you would like save current content into database and overwrite existing saved data?
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
                            disabled={isUploading}
                        >
                            Disagree
                        </Button>
                        <Button
                            onClick={() => save()}
                            disabled={(data === null) || (isUploading)}
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