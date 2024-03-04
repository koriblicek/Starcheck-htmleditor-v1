import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import { mdiWindowClose } from '@mdi/js';
import { $getNodeByKey, LexicalEditor, NodeKey } from 'lexical';
import { useState } from 'react';
import { FigureNode, UpdateFigurePayload } from '../FigureNode';
import Icon from '@mdi/react';

export interface IEditFigureDialogProps {
    editor: LexicalEditor;
    nodeKey: NodeKey;
    open: boolean;
    onClose: () => void;
}
export function EditFigureDialog({ editor, nodeKey, open, onClose }: IEditFigureDialogProps) {

    const editorState = editor.getEditorState();
    const node = editorState.read(() => $getNodeByKey(nodeKey) as FigureNode);

    const [figureClasses, setFigureClasses] = useState<string>(node.getFigureClasses());
    const [caption, setCaption] = useState<string>(node.getCaption());

    const handleUpdate = () => {
        const payload: UpdateFigurePayload = { figureClasses, caption };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }
        onClose();
    };

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
                        <TextField fullWidth autoFocus id="figure-classes" name="figure-classes" variant="outlined" size='small' value={figureClasses} type="text"
                            onChange={(e) => setFigureClasses(e.target.value)}
                            label="Figure classes:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                </Grid>
                <DialogContentText>
                    <sup>1</sup>Possible values: [<i>auto</i>, [nnn]<i>%</i>, [nnn]<i>px</i>]
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleUpdate}
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

