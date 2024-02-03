import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import { EmbedMatchResult } from '@lexical/react/LexicalAutoEmbedPlugin'; import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import { ICON_SIZE } from 'src/types';
import { useState } from 'react';

const parseYouTubeUrl = async (url: string) => {
    const match =
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;
    if (id != null) {
        return {
            id,
            url,
        };
    }
    return null;
};


export interface IYouTubeDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (link: string) => void;
}

export function YouTubeDialog({ open, onClose, onConfirm }: IYouTubeDialogProps) {
    const [value, setValue] = useState<string>("");
    const [link, setLink] = useState<EmbedMatchResult | null>(null);

    function checkLink(link: string) {
        setValue(link);
        parseYouTubeUrl(link)
            .then((result) => {
                setLink(result);
            });
    }

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                Embed Youtube Video
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
                    <TextField fullWidth autoFocus id="youtube-link-src" name="youtube-link-src" variant="outlined" size='small' value={value} type="text"
                        onChange={(e) => checkLink(e.target.value)}
                        label="YouTube URL link:"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={link === null} onClick={() => onConfirm(link!.id)} variant="text" color="primary" size="small" title="Embed" startIcon={<Icon path={mdiCheck} size={1} />}>Embed</Button>
            </DialogActions>
        </Dialog>
    );
}
