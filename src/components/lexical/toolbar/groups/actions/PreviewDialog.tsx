import { Breakpoint, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ICON_SIZE } from 'src/types';
import { mdiWindowClose } from '@mdi/js';
import { mdiSizeXs } from '@mdi/js';
import { mdiSizeS } from '@mdi/js';
import { mdiSizeM } from '@mdi/js';
import { mdiSizeL } from '@mdi/js';
import { mdiSizeXl } from '@mdi/js';
import { useState } from 'react';
import Icon from '@mdi/react';

const sizes: [string, JSX.Element][] = [
    ['xs', <Icon path={mdiSizeXs} size={1} />],
    ['sm', <Icon path={mdiSizeS} size={1} />],
    ['md', <Icon path={mdiSizeM} size={1} />],
    ['lg', <Icon path={mdiSizeL} size={1} />],
    ['xl', <Icon path={mdiSizeXl} size={1} />]
];
export interface IPreviewDialogProps {
    open: boolean;
    htmlData: string;
    onClose: () => void;
}

export function PreviewDialog({ open, onClose, htmlData }: IPreviewDialogProps) {

    const [size, setSize] = useState<string>("xl");

    //const src = 'data:text/html;charset=utf-8,' + encodeURI(htmlData);

    const handleSize = (_: React.MouseEvent<HTMLElement>, newSize: string | null) => {
        if (newSize !== null) {
            setSize(newSize);
        }
    };
    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth={size as Breakpoint}>
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
                    {/* <iframe src={src} style={{width:'100%', height:'100%'}}/> */}
                    <div dangerouslySetInnerHTML={{ __html: htmlData }} />
            </DialogContent>
            <DialogActions>
                <ToggleButtonGroup aria-label="text alignment" size='small' exclusive value={size} onChange={handleSize}>
                    {sizes.map(item => {
                        return (
                            <ToggleButton value={item[0]} key={item[0]}>
                                {item[1]}
                            </ToggleButton>
                        );
                    })
                    }
                </ToggleButtonGroup>
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
