import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiLinkOff } from '@mdi/js';
import { mdiWindowClose } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import { ICON_SIZE } from 'src/types';

export interface ILinkDialogProps {
    open: boolean;
    url: string;
    onClose: () => void;
    onConfirm: (url: string) => void;
    onLinkDelete: () => void;
}

export function LinkDialog({ open, url, onClose, onLinkDelete, onConfirm }: ILinkDialogProps) {

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                <DialogContentText>
                    Set or Delete link
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
            <DialogContent>
                <TextField fullWidth autoFocus id="url" name="url" variant="standard" size='small' defaultValue={url} type="url" margin="dense" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onLinkDelete} variant="contained" color="error" size="small" title="Delete Link" startIcon={<Icon path={mdiLinkOff} size={1} />}>Delete Link</Button>
                <Button onClick={() => onConfirm(url)} variant="contained" color="success" size="small" title="Set Link" startIcon={<Icon path={mdiCheck} size={1} />}>Set Link</Button>
            </DialogActions>
        </Dialog>
    );
}
