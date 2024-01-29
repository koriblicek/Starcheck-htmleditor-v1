import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { FontFamilyListType, ICON_SIZE, StyleTextData } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { mdiFormatFont } from '@mdi/js';
import { mdiFormatSize } from '@mdi/js';

interface IStyleTextButtonsGroupProps {
    editor: LexicalEditor;
    fontFamilyList?: FontFamilyListType[];
    fontFamilyListWidth?: string;
    fontSizeList?: [number, string][];
    fontSizeListWidth?: string;
}
const initialState: StyleTextData = { font: "", size: null };

export default function StyleTextButtonsGroup({
    editor,
    fontFamilyList = [{ name: "Arial", family: "'Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'" }, { name: "Calibri", family: "'Calibri', 'Candara', 'Segoe', 'Segoe UI', 'Optima', 'Arial', 'sans-serif'" }],
    fontFamilyListWidth = "120px",
    fontSizeList = [[8, "8px"], [9, "9px"], [10, "10px"], [11, "11px"], [12, "12px"], [14, "14px"], [16, "16px"], [18, "18px"], [20, "20px"], [22, "22px"], [24, "24px"], [26, "26px"], [28, "28px"], [36, "36px"], [48, "48px"], [72, "72px"]],
    fontSizeListWidth = "28px"
}: IStyleTextButtonsGroupProps) {

    const [anchorElFonts, setAnchorElFonts] = useState<null | Element>(null);
    const [anchorElSizes, setAnchorElSizes] = useState<null | Element>(null);

    const [state, setState] = useState<StyleTextData>(initialState);

    const handleClickFonts = useCallback((event: React.MouseEvent) => {
        setAnchorElFonts(event.currentTarget);
    }, []);

    const handleClickSizes = useCallback((event: React.MouseEvent) => {
        setAnchorElSizes(event.currentTarget);
    }, []);

    const handleCloseFonts = useCallback(() => {
        setAnchorElFonts(null);
    }, []);

    const handleCloseSizes = useCallback(() => {
        setAnchorElSizes(null);
    }, []);

    const handleSetStyle = useCallback((style: string, option: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                $patchStyleText(selection, {
                    [style]: option,
                });
            }
        });
    }, [editor]);

    const updateState = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const fontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', '');
            const findFontFamily = fontFamilyList.find((fonts) => fonts.family === fontFamily);
            const finalFontName = findFontFamily ? findFontFamily.name : '';
            const fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '');
            const findFontSize = fontSizeList.find((sizes) => sizes[1] === fontSize);
            const finalFontSize = findFontSize ? findFontSize[0] : null;
            setState((prevState) => {
                return {
                    ...prevState,
                    font: finalFontName,
                    size: finalFontSize
                };
            });
        } else {
            setState(initialState);
        }
    }, [editor, fontFamilyList, fontSizeList]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateState();
            });
        });
    }, [editor, updateState]);

    const menuFonts = useMemo(() => {
        return (
            <Menu
                id="style-text-fonts-menu"
                anchorEl={anchorElFonts}
                open={Boolean(anchorElFonts)}
                onClose={handleCloseFonts}
                disableAutoFocusItem
            >
                {fontFamilyList.map((font) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                handleSetStyle('font-family', font.family);
                                handleCloseFonts();
                            }}
                            key={font.name}
                            selected={font.name === state.font}
                            sx={{ py: 0 }}
                            title={font.family}
                        >
                            {<Typography variant='subtitle1' sx={{ px: 0.5 }}>{font.name}</Typography>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorElFonts, handleCloseFonts, fontFamilyList, handleSetStyle]);

    const menuSizes = useMemo(() => {
        return (
            <Menu
                id="style-text-sizes-menu"
                anchorEl={anchorElSizes}
                open={Boolean(anchorElSizes)}
                onClose={handleCloseSizes}
                disableAutoFocusItem
            >
                {fontSizeList.map((size) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                handleSetStyle('font-size', size[1]);
                                handleCloseSizes();
                            }}
                            key={size[1]}
                            selected={size[0] === state.size}
                            sx={{ py: 0 }}
                            title={size[1]}
                        >
                            {<Typography variant='subtitle1' sx={{ px: 0.5 }}>{size[0]}</Typography>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorElSizes, handleCloseSizes, fontSizeList, handleSetStyle]);

    const toggleButtonFonts = useMemo(() => {
        if (fontFamilyList.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={
                    <Fragment>
                        <Icon path={mdiFormatFont} size={ICON_SIZE} />
                        <Box sx={{ display: 'flex', alignItems: 'center', width: `${fontFamilyListWidth}`, justifyContent: 'flex-start' }}>
                            <Typography variant='button' sx={{ px: 0.5, overflow: 'clip' }} noWrap textOverflow='ellipsis'>
                                {(state.font === "") ? "" : state.font}
                            </Typography>
                        </Box>
                        <Icon path={mdiChevronDown} size={ICON_SIZE} />
                    </Fragment>
                }
                title={'Extra Formatting'}
                onClick={(e: React.MouseEvent) => handleClickFonts(e)}
            />
        );
    }, [fontFamilyList, fontFamilyListWidth, state, handleClickFonts]);

    const toggleButtonSize = useMemo(() => {
        if (fontSizeList.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={
                    <Fragment>
                        <Icon path={mdiFormatSize} size={ICON_SIZE} />
                        <Box sx={{ display: 'flex', alignItems: 'center', width: `${fontSizeListWidth}`, justifyContent: 'flex-start' }}>
                            <Typography variant='button' sx={{ px: 0.5, overflow: 'clip' }} noWrap textOverflow='ellipsis'>
                                {state.size !== null ? state.size : ""}
                            </Typography>
                        </Box>
                        <Icon path={mdiChevronDown} size={ICON_SIZE} />
                    </Fragment>
                }
                sx={{}}
                title={'Extra Formatting'}
                onClick={(e: React.MouseEvent) => handleClickSizes(e)}
            />
        );
    }, [fontSizeList, fontSizeListWidth, state, handleClickSizes]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width="auto">
                <Grid item>
                    {toggleButtonFonts}
                </Grid>
                <Grid item>
                    {toggleButtonSize}
                </Grid>
            </Grid>
            {menuFonts}
            {menuSizes}
        </Fragment>
    );
}
