import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import { mdiWindowClose } from '@mdi/js';
import { useCallback, useEffect, useState } from 'react';
import { ClassesSelection } from '../../shared/ClassesSelection';
import { useAppSelector } from 'src/store/hooks';
import { HorizontalRuleNode } from '../HorizontalRuleNode';
import Icon from '@mdi/react';

export interface EditHorizontalRuleDialog {
    open: boolean;
    node: HorizontalRuleNode;
    onClose: () => void;
    onUpdate: (horizontalRuleClasses: string) => void;
}

export function EditHorizontalRuleDialog({ open, onClose, node, onUpdate }: EditHorizontalRuleDialog) {

    const [horizontalRuleClasses, setHorizontalRuleClasses] = useState<string>(node.getHorizontalRuleClasses());

    const { cssData } = useAppSelector(state => state.htmlEditorAppData);

    const handleUpdateHorizontalRuleClasses = useCallback((classes: string) => {
        setHorizontalRuleClasses(classes);
    }, []);

    useEffect(() => {
        if (open) {
            setHorizontalRuleClasses(node.getHorizontalRuleClasses());
        }
    }, [open, node]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Edit Horizontal Rule properties:
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
                        <ClassesSelection componentClasses={node.getHorizontalRuleClasses()} updateComponentClasses={handleUpdateHorizontalRuleClasses} availableClasses={cssData['horizontal-rule']} open={open} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onUpdate(horizontalRuleClasses);
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

