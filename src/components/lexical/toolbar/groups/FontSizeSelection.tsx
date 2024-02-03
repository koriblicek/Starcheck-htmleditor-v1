import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { FontSizeListType, ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { mdiFormatSize } from '@mdi/js';

interface IFontSizeSelectionProps {
    editor: LexicalEditor;
    fontSizeList?: FontSizeListType;
    fixedWidth?: string;
}

export default function FontSizeSelection({ editor, fontSizeList = [[8, "8px"], [9, "9px"], [10, "10px"], [11, "11px"], [12, "12px"], [14, "14px"], [16, "16px"]], fixedWidth = "auto" }: IFontSizeSelectionProps) {
    const [anchorElSizes, setAnchorElSizes] = useState<null | Element>(null);

    const [state, setState] = useState<number | null>(null);

    const handleClickSizes = useCallback((event: React.MouseEvent) => {
        setAnchorElSizes(event.currentTarget);
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
            const fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '');
            const findFontSize = fontSizeList.find((sizes) => sizes[1] === fontSize);
            const finalFontSize = findFontSize ? findFontSize[0] : null;
            setState(finalFontSize);
        } else {
            setState(null);
        }
    }, [editor, fontSizeList]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateState();
            });
        });
    }, [editor, updateState]);

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
                            selected={size[0] === state}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', width: `${fixedWidth}`, justifyContent: 'flex-start' }}>
                            <Typography variant='button' sx={{ px: 0.5, overflow: 'clip' }} noWrap textOverflow='ellipsis'>
                                {state !== null ? state : ""}
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
    }, [fontSizeList, fixedWidth, state, handleClickSizes]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width="auto">
                <Grid item>
                    {toggleButtonSize}
                </Grid>
            </Grid>
            {menuSizes}
        </Fragment>
    );
}
