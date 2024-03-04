import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';

export interface IPreviewDialogProps {
    open: boolean;
    htmlData: string;
    onClose: () => void;
}
export function PreviewDialog({ open, onClose, htmlData }: IPreviewDialogProps) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog onClose={onClose} open={open} fullScreen={fullScreen} fullWidth maxWidth="xl">
            <DialogTitle>
                Preview
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
                <div dangerouslySetInnerHTML={{ __html: htmlData }} />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="text"
                    color="inherit"
                    size="small"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
