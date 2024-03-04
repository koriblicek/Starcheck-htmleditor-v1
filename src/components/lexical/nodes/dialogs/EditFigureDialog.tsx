import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import { mdiWindowClose } from '@mdi/js';
import { useCallback, useEffect, useState } from 'react';
import { FigureNode } from '../FigureNode';
import { ClassesSelection } from '../../shared/ClassesSelection';
import { useAppSelector } from 'src/store/hooks';
import Icon from '@mdi/react';

export interface IEditFigureDialogProps {
    open: boolean;
    node: FigureNode;
    onClose: () => void;
    onUpdate: (caption: string, figureClasses: string) => void;
}

export function EditFigureDialog({ open, onClose, node, onUpdate }: IEditFigureDialogProps) {

    const [figureClasses, setFigureClasses] = useState<string>(node.getFigureClasses());
    const [caption, setCaption] = useState<string>(node.getCaption());

    const { figure } = useAppSelector(state => state.htmlEditorAppData.cssData);

    const handleUpdateFigureClasses = useCallback((classes: string) => {
        setFigureClasses(classes);
    }, []);

    useEffect(() => {
        if (open) {
            setFigureClasses(node.getFigureClasses());
        }
    }, [open, node]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Edit Figure properties:
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
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField fullWidth autoFocus id="figure-caption-alt" name="figure-caption-alt" variant="outlined" size='small' value={caption} type="text"
                            onChange={(e) => setCaption(e.target.value)}
                            label="Figure caption / Image alt:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ClassesSelection componentClasses={node.getFigureClasses()} updateComponentClasses={handleUpdateFigureClasses} availableClasses={figure} open={open} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onUpdate(caption, figureClasses);
                        onClose();
                    }}
                    variant="text"
                    color="primary"
                    size="small"
                    title="Update"
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

