import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Popover } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { ICON_SIZE } from "src/types";
import Sketch from '@uiw/react-color-sketch';
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatColorText } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

interface ITextColorSelectionProps {
    editor: LexicalEditor;
}

export default function TextColorSelection({ editor }: ITextColorSelectionProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [color, setColor] = useState<string>("#000");

    const onOpen = useCallback((e: React.MouseEvent) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const onClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const onChangeColor = useCallback((hexaColor: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                $patchStyleText(selection, { ["color"]: hexaColor });
            }
        });
    }, [editor]);

    const updateColorButton = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateColorButton();
            });
        });
    }, [editor, updateColorButton]);

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
                <Sketch color={color} onChange={(color) => onChangeColor(color.hexa)} />
            </Popover>
        );
    }, [anchorEl, onClose, onChangeColor, color]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                <Grid item>
                    <ToolbarToggleButton
                        selected={false}
                        value='color'
                        label={<><Icon path={mdiFormatColorText} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                        title='Text Color'
                        onClick={(e) => onOpen(e)}
                    />
                </Grid>
            </Grid>
            {colorPicker}
        </Fragment>
    );
}
