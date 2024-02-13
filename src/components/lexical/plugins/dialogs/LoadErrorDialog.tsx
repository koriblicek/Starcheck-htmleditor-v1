import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { IGetErrorObj } from 'src/hooks/useGetAxiosFunction';

export interface ILoadingErrorDialogProps {
    onClose: () => void;
    error: IGetErrorObj | null;
}

export function LoadingErrorDialog({ onClose, error }: ILoadingErrorDialogProps) {
    return (
        <Dialog
            open={error !== null}
            onClose={onClose}
        >
            <DialogTitle>
                Error to load data from REST API!
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">Error Code: {error?.code}</Typography>
                <Typography variant="body1">Message: {error?.message}</Typography>
                <Typography variant="body1">Url: {error?.url}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
