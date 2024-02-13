import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';

export interface ISaveLocalStorageDialogProps {
    open: boolean;
    onAction: (confirm: boolean) => void;
}
export function SaveLocalStorageDialog({ open, onAction }: ISaveLocalStorageDialogProps) {

    return (
        <Dialog onClose={() => onAction(false)} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Save content to Local Storage
                <IconButton
                    onClick={() => onAction(false)}
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
                <DialogContentText>
                    Are you sure you would like save current content and overwrite existing saved data?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onAction(false)}
                    variant="text"
                    color="inherit"
                    size="small"
                >
                    Disagree
                </Button>
                <Button
                    onClick={() => onAction(true)}
                    variant="text"
                    color="error"
                    size="small"
                >
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
}