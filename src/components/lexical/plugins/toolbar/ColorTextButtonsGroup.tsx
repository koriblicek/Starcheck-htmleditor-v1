import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Popover } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { ColorType, ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatColorText } from '@mdi/js';
import { mdiFormatColorFill } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import Sketch from '@uiw/react-color-sketch';

interface IColorTextButtonsGroupProps {
    editor: LexicalEditor;
    include?: ColorType[];
}

type Setup = Record<ColorType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    font_color: { icon: <><Icon path={mdiFormatColorText} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>, title: "Font Color" },
    background_color: { icon: <><Icon path={mdiFormatColorFill} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>, title: "Background Color" }
} as Setup;


export default function ColorTextButtonsGroup({ editor, include = ['font_color', 'background_color'] }: IColorTextButtonsGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);
    const [state, setState] = useState<ColorType | null>(null);
    const [color, setColor] = useState<string>("#000");
    const [backgroundColor, setBackgroundColor] = useState<string>("#000");
    const [finalColor, setFinalColor] = useState<string>("#000");

    const onOpen = useCallback((e: React.MouseEvent, type: ColorType) => {
        setAnchorEl(e.currentTarget);
        setState(type);
        switch (type) {
            case "font_color":
                setFinalColor(color);
                break;
            case "background_color":
                setFinalColor(backgroundColor);
                break;
        }

    }, [backgroundColor, color]);

    const onClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const onChangeColor = useCallback((hexaColor: string) => {
        if (state === null) {
            return;
        }
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                switch (state) {
                    case "font_color":
                        $patchStyleText(selection, { ["color"]: hexaColor });
                        return;
                    case "background_color":
                        $patchStyleText(selection, { ["background-color"]: hexaColor });
                        return;
                }
            }
        });
    }, [editor, state]);

    const updateColorButtons = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
            setBackgroundColor($getSelectionStyleValueForProperty(selection, 'background-color', '#000'));
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateColorButtons();
            });
        });
    }, [editor, updateColorButtons]);

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
                <Sketch color={finalColor} onChange={(color) => onChangeColor(color.hexa)} />
            </Popover>
        );
    }, [anchorEl, onClose, onChangeColor, finalColor]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {include.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={false}
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={(e) => onOpen(e, type)}
                        />
                    </Grid>
                ))}
            </Grid>
            {colorPicker}
        </Fragment>
    );
}
