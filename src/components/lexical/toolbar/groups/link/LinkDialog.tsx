import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiLinkOff } from '@mdi/js';
import { mdiWindowClose } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import { ICON_SIZE, LinkData, linkAttributeTartgetTypeList } from 'src/types';
import { useCallback, useEffect, useState } from 'react';
import { ClassesSelection } from 'src/components/lexical/shared/ClassesSelection';
import { useAppSelector } from 'src/store/hooks';

export interface ILinkDialogProps {
    open: boolean;
    data: LinkData;
    onClose: () => void;
    onConfirm: (linkData: LinkData) => void;
    onLinkDelete: () => void;
}

export function LinkDialog({ open, data, onClose, onLinkDelete, onConfirm }: ILinkDialogProps) {
    const [linkData, setLinkData] = useState<LinkData>({ url: "", target: "_self", title: "", classes: "" });

    const { cssData } = useAppSelector(state => state.htmlEditorAppData);

    useEffect(() => {
        setLinkData((prevState) => { return { ...prevState, ...data, target: data.target ? data.target : "_self", title: data.title ? data.title : "", classes: data.classes ? data.classes : "" }; });
    }, [data]);

    const handleUpdateCustomLinkClasses = useCallback((classes: string) => {
        setLinkData((prevState) => { return { ...prevState, classes: classes }; });
    }, []);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Set or Delete link
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
                <Stack direction='column' gap={1}>
                    <TextField fullWidth autoFocus id="link-href" name="link-href" variant="outlined" size='small' value={linkData.url} type="text"
                        onChange={(e) => setLinkData((prevState) => { return { ...prevState, url: e.target.value }; })}
                        label="Link URL:"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <FormControl fullWidth variant='outlined'>
                        <InputLabel id="link-target-label" htmlFor="link-target-input">Open link in:</InputLabel>
                        <Select
                            labelId="link-target-label"
                            id="link-target"
                            value={linkData.target}
                            size='small'
                            label="Open link in:"
                            inputProps={{ id: 'link-target-input' }}
                            onChange={(e) => setLinkData((prevState) => { return { ...prevState, target: e.target.value }; })}
                        >
                            {linkAttributeTartgetTypeList.map(target => {
                                return <MenuItem key={target} value={target}>{target}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                    <TextField fullWidth id="link-title" name="link-title" variant="outlined" size='small' value={linkData.title} type="text"
                        onChange={(e) => setLinkData((prevState) => { return { ...prevState, title: e.target.value }; })}
                        label="Link title:"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <ClassesSelection componentClasses={linkData.classes ? linkData.classes : ""} updateComponentClasses={handleUpdateCustomLinkClasses} availableClasses={cssData['custom-link']} open={open} />
                    {/* <TextField fullWidth id="link-classes" name="link-classes" variant="outlined" size='small' value={linkData.classes} type="text"
                        onChange={(e) => setLinkData((prevState) => { return { ...prevState, classes: e.target.value }; })}
                        label="Link classes:"
                        InputLabelProps={{
                            shrink: true
                        }}
                    /> */}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLinkDelete} variant="text" color="error" size="small" title="Delete Link" startIcon={<Icon path={mdiLinkOff} size={1} />}>Delete Link</Button>
                <Button onClick={() => onConfirm(linkData)} variant="text" color="primary" size="small" title="Set Link" startIcon={<Icon path={mdiCheck} size={1} />}>Set Link</Button>
            </DialogActions>
        </Dialog>
    );
}
