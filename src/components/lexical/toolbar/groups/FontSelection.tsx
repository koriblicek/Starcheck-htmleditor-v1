import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { FontFamilyListType, ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { mdiFormatFont } from '@mdi/js';

interface IFontSelectionProps {
    editor: LexicalEditor;
    fontsFamilyList?: FontFamilyListType[];
    fixedWidth?: string;
}

export default function FontSelection({ editor, fontsFamilyList = [{ name: "Default font", family: '' }], fixedWidth = "auto", }: IFontSelectionProps) {

    const [anchorElFonts, setAnchorElFonts] = useState<null | Element>(null);

    const [state, setState] = useState<string>("");

    const handleClickFonts = useCallback((event: React.MouseEvent) => {
        setAnchorElFonts(event.currentTarget);
    }, []);

    const handleCloseFonts = useCallback(() => {
        setAnchorElFonts(null);
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
            const findFontFamily = fontsFamilyList.find((fonts) => fonts.family === fontFamily);
            const finalFontName = findFontFamily ? findFontFamily.name : '';
            setState(finalFontName);
        } else {
            setState("");
        }
    }, [editor, fontsFamilyList]);

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
                {fontsFamilyList.map((font) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                handleSetStyle('font-family', font.family);
                                handleCloseFonts();
                            }}
                            key={font.name}
                            selected={font.name === state}
                            sx={{ py: 0 }}
                            title={font.family}
                        >
                            {<Typography variant='subtitle1' sx={{ px: 0.5 }}>{font.name}</Typography>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorElFonts, handleCloseFonts, fontsFamilyList, handleSetStyle]);

    const toggleButtonFonts = useMemo(() => {
        if (fontsFamilyList.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={
                    <Fragment>
                        <Icon path={mdiFormatFont} size={ICON_SIZE} />
                        <Box sx={{ display: 'flex', alignItems: 'center', width: `${fixedWidth}`, justifyContent: 'flex-start' }}>
                            <Typography variant='button' sx={{ px: 0.5, overflow: 'clip' }} noWrap textOverflow='ellipsis'>
                                {(state === "") ? "" : state}
                            </Typography>
                        </Box>
                        <Icon path={mdiChevronDown} size={ICON_SIZE} />
                    </Fragment>
                }
                title={'Extra Formatting'}
                onClick={(e: React.MouseEvent) => handleClickFonts(e)}
            />
        );
    }, [fontsFamilyList, fixedWidth, state, handleClickFonts]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width="auto">
                <Grid item>
                    {toggleButtonFonts}
                </Grid>
            </Grid>
            {menuFonts}
        </Fragment>
    );
}
