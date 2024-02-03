import { Alert, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { ICON_SIZE, NewImagePayload } from 'src/types';
import { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { mdiDownload } from '@mdi/js';

export interface INewImageUrlDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (imageData: NewImagePayload) => void;
}
const initialData: NewImagePayload = { src: "https://" };
export function NewImageUrlDialog({ open, onClose, onConfirm }: INewImageUrlDialogProps) {
    const [imageData, setImageData] = useState<NewImagePayload>(initialData);
    const [isValid, setIsValid] = useState<boolean | null>();
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    useEffect(() => {
        setIsValid(null);
        setIsVerifying(false);
        setImageData(initialData);
    }, [open]);

    const verifyImage = (path: string) => {
        setIsVerifying(true);
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path;
        })
            .then((response) => {
                if (response) {
                    onConfirm(imageData);
                } else {
                    setIsValid(false);
                }
                setIsVerifying(false);
            });
    };

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                {/* <DialogContentText> */}
                Insert Image
                {/* </DialogContentText> */}
                <IconButton
                    onClick={onClose}
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
                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                        <TextField fullWidth autoFocus id="link-href" name="link-href" variant="outlined" size='small' value={imageData.src} type="text"
                            disabled={(isVerifying === true) || (isValid === false)}
                            onChange={(e) => {
                                setImageData((prevState) => { return { ...prevState, src: e.target.value }; });
                                setIsValid(null);
                            }}
                            label="Image url 'src':"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onFocus={event => {
                                event.target.select();
                            }}
                        />
                    </Grid>
                    <Grid item justifyContent="center">
                        <Collapse in={isVerifying} >
                            <CircularProgress size={20} color="primary" sx={{ mt: 1 }} />
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={isValid === false}>
                            <Alert severity="error" sx={{ mt: 1 }} onClose={() => { setIsValid(null); }}>Image URL Error! Try again.</Alert>
                        </Collapse>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={(isVerifying === true) || (isValid === false)}
                    onClick={() => {
                        verifyImage(imageData.src);
                    }}
                    variant="contained"
                    color="primary"
                    size="small"
                    title="Insert Image"
                    startIcon={<Icon path={mdiDownload} size={ICON_SIZE} />}
                >
                    Insert Image
                </Button>
            </DialogActions>
        </Dialog>
    );
}
