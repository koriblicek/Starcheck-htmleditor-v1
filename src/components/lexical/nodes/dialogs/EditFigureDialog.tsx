import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { /*Float, */Height, ICON_SIZE, Width } from 'src/types';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { $getNodeByKey, LexicalEditor, NodeKey } from 'lexical';
import { useState } from 'react';
import { FigureNode, UpdateFigurePayload } from '../FigureNode';

export interface IEditFigureDialogProps {
    editor: LexicalEditor;
    nodeKey: NodeKey;
    open: boolean;
    onClose: () => void;
}
export function EditFigureDialog({ editor, nodeKey, open, onClose }: IEditFigureDialogProps) {

    const editorState = editor.getEditorState();
    const node = editorState.read(() => $getNodeByKey(nodeKey) as FigureNode);

    const [altText, setAltText] = useState<string>(node.getAltText());
    const [caption, setCaption] = useState<string>(node.getCaption());
    // const [float, setFloat] = useState<Float>(node.getFloat());
    const [width, setWidth] = useState<Width>(node.getWidth());
    const [height, setHeight] = useState<Height>(node.getHeight());

    const handleUpdate = () => {
        const payload: UpdateFigurePayload = { altText, caption, /*float, */width, height };
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
                        <TextField fullWidth autoFocus id="figure-caption" name="figure-caption" variant="outlined" size='small' value={caption} type="text"
                            onChange={(e) => setCaption(e.target.value)}
                            label="Image caption:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="figure-img-alt" name="figure-img-alt" variant="outlined" size='small' value={altText} type="text"
                            onChange={(e) => setAltText(e.target.value)}
                            label="Image alternative text:"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel id="figure-float-label" htmlFor="figure-float">Float:</InputLabel>
                            <Select
                                // labelId="figure-float"
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
                    </Grid> */}
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
                    <sup>1</sup>Possible values: [<i>auto</i>, 100<i>%</i>, 100<i>px</i>]
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

