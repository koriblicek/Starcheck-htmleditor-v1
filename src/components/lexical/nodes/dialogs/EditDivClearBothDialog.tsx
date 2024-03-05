import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import { mdiWindowClose } from '@mdi/js';
import { useCallback, useEffect, useState } from 'react';
import { ClassesSelection } from '../../shared/ClassesSelection';
import { useAppSelector } from 'src/store/hooks';
import { DivClearBothNode } from '../DivClearBothNode';
import Icon from '@mdi/react';

export interface EditDivClearBothDialog {
    open: boolean;
    node: DivClearBothNode;
    onClose: () => void;
    onUpdate: (divClearBothClasses: string) => void;
}

export function EditDivClearBothDialog({ open, onClose, node, onUpdate }: EditDivClearBothDialog) {

    const [divClearBothClasses, setDivClearBothClasses] = useState<string>(node.getDivClearBothClasses());

    const { cssData } = useAppSelector(state => state.htmlEditorAppData);

    const handleUpdateDivClearBothClasses = useCallback((classes: string) => {
        setDivClearBothClasses(classes);
    }, []);

    useEffect(() => {
        if (open) {
            setDivClearBothClasses(node.getDivClearBothClasses());
        }
    }, [open, node]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Edit Div Clear Both properties:
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
                        <ClassesSelection componentClasses={node.getDivClearBothClasses()} updateComponentClasses={handleUpdateDivClearBothClasses} availableClasses={cssData['div-clear-both']} open={open} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onUpdate(divClearBothClasses);
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
        </Dialog >
    );
}

