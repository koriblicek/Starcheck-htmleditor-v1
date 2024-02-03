import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { $getNodeByKey, LexicalEditor, NodeKey } from 'lexical';
import { Float, Height, InlineImageNode, UpdateInlineImagePayload, Width } from '../InlineImageNode';
import { useState } from 'react';

export interface IEditInlineImageDialogProps {
    editor: LexicalEditor;
    nodeKey: NodeKey;
    open: boolean;
    onClose: () => void;
}
export function EditInlineImageDialog({ editor, nodeKey, open, onClose }: IEditInlineImageDialogProps) {

    const editorState = editor.getEditorState();
    const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode);

    const [altText, setAltText] = useState<string>(node.getAltText());
    const [caption, setCaption] = useState<string>(node.getCaption());
    const [float, setFloat] = useState<Float>(node.getFloat());
    const [width, setWidth] = useState<Width>(node.getWidth());
    const [height, setHeight] = useState<Height>(node.getHeight());

    const handleUpdate = () => {
        const payload: UpdateInlineImagePayload = { altText, caption, float, width, height };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }
        onClose();
    };

    console.log(node);
    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Edit image properties:
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
                        <TextField fullWidth autoFocus id="figure-caption" name="figure-caption" variant="outlined" size='small' value={caption} type="text"
                            onChange={(e) => setCaption(e.target.value)}
                            label="Image caption:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="img-alt" name="img-alt" variant="outlined" size='small' value={altText} type="text"
                            onChange={(e) => setAltText(e.target.value)}
                            label="Image alternative text:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel id="figure-float-label" htmlFor="figure-floa-label">Float:</InputLabel>
                            <Select
                                labelId="figure-float"
                                id="figure-float"
                                value={float || "none"}
                                size='small'
                                label="Open link in 'target':"
                                inputProps={{ id: 'figure-float' }}
                                onChange={(e) => setFloat(e.target.value as Float)}
                            >
                                {["none", "left", "right"].map(target => {
                                    return <MenuItem key={target} value={target}>{target}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="img-width" name="img-width" variant="outlined" size='small' value={width || "100%"} type="text"
                            onChange={(e) => setWidth(e.target.value)}
                            label={<>Image width<sup>1</sup>:</>}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth id="img-height" name="img-height" variant="outlined" size='small' value={height || "auto"} type="text"
                            onChange={(e) => setHeight(e.target.value)}
                            label={<>Image height:<sup>1</sup>:</>}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                </Grid>
                <DialogContentText>
                    <sup>1</sup>Possible values:<br />
                    <ul style={{ margin: 0 }}>
                        <li><b>auto</b> - browser will calculate size</li>
                        <li><u>nnn</u><b>%</b> - percentage value</li>
                        <li><u>nnn</u><b>px</b> - value in specified units (preferably px)</li>
                    </ul>
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

