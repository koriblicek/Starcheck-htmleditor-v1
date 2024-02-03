import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Popover } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { ICON_SIZE } from "src/types";
import Sketch from '@uiw/react-color-sketch';
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatColorFill } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

interface ITextBackgroundColorSelectionProps {
    editor: LexicalEditor;
}

export default function TextBackgroundColorSelection({ editor }: ITextBackgroundColorSelectionProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [backgroundColor, setBackgroundColor] = useState<string>("#000");

    const onOpen = useCallback((e: React.MouseEvent) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const onClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const onChangeBackgroundColor = useCallback((hexaColor: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                $patchStyleText(selection, { ["background-color"]: hexaColor });
            }
        });
    }, [editor]);

    const updateBackgroundColorButton = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setBackgroundColor($getSelectionStyleValueForProperty(selection, 'background-color', '#000'));
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateBackgroundColorButton();
            });
        });
    }, [editor, updateBackgroundColorButton]);

    const colorPicker = useMemo(() => {
        return (
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Sketch color={backgroundColor} onChange={(color) => onChangeBackgroundColor(color.hexa)} />
            </Popover>
        );
    }, [anchorEl, onClose, onChangeBackgroundColor, backgroundColor]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                <Grid item>
                    <ToolbarToggleButton
                        selected={false}
                        value='color'
                        label={<><Icon path={mdiFormatColorFill} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                        title='Text Background Color'
                        onClick={(e) => onOpen(e)}
                    />
                </Grid>
            </Grid>
            {colorPicker}
        </Fragment>
    );
}
