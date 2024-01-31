import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import { ICON_SIZE, NewImagePayload } from 'src/types';
import { useEffect, useState } from 'react';

export interface INewImageUrlDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (imageData: NewImagePayload) => void;
}
const initialData: NewImagePayload = { src: "https://", altText: "" };
export function NewImageUrlDialog({ open, onClose, onConfirm }: INewImageUrlDialogProps) {
    const [imageData, setImageData] = useState<NewImagePayload>(initialData);

    useEffect(() => {
        setImageData(initialData);
    }, [open]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                <DialogContentText>
                    Insert Image
                </DialogContentText>
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
                <Stack direction='column' gap={1}>
                    <TextField fullWidth autoFocus id="link-href" name="link-href" variant="outlined" size='small' value={imageData.src} type="text" margin="dense"
                        onChange={(e) => setImageData((prevState) => { return { ...prevState, src: e.target.value }; })}
                        label="Image url 'src':"
                        InputLabelProps={{
                            shrink: true
                        }}
                        onFocus={event => {
                            event.target.select();
                        }}
                    />
                    <TextField fullWidth id="link-title" name="link-title" variant="outlined" size='small' value={imageData.altText} type="text" margin="dense"
                        onChange={(e) => setImageData((prevState) => { return { ...prevState, altText: e.target.value }; })}
                        label="Alternative text 'alt':"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onConfirm(imageData)} variant="text" color="primary" size="small" title="Set Link" startIcon={<Icon path={mdiCheck} size={1} />}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}
