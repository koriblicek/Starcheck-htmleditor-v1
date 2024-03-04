import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelection, $isNodeSelection, LexicalEditor } from "lexical";
import { ICON_SIZE, NewImagePayload } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiImageOutline } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import { NewImageUrlDialog } from "./image/NewImageUrlDialog";
import { INSERT_FIGURE_COMMAND } from "../../plugins/FigurePlugin";


interface IImageSelectionProps {
    editor: LexicalEditor;
}

type Setup = { icon: JSX.Element, title: string; };

const buttonSetup = { icon: <><Icon path={mdiImageOutline} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>, title: "Insert Image" } as Setup;

export default function ImageSelection({ editor }: IImageSelectionProps) {

    const [enabled, setEnabled] = useState<boolean>(true);

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [openNewImageUrl, setOpenNewImageUrl] = useState<boolean>(false);

    const handleClickToggleButton = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const menu = useMemo(() => {
        return (
            <Menu
                id="image-source-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                disableAutoFocusItem
            >
                <MenuItem
                    onClick={() => {
                        setOpenNewImageUrl(true);
                        handleCloseMenu();
                    }}
                    selected={false}
                    sx={{ py: 0 }}
                >
                    {<Typography variant='subtitle1' sx={{ px: 0.5 }}>Figure</Typography>}
                </MenuItem>
            </Menu>
        );
    }, [anchorEl, handleCloseMenu]);

    const onConfirm = useCallback((payload: NewImagePayload) => {
        // editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, { src: payload.src });
        editor.dispatchCommand(INSERT_FIGURE_COMMAND, { src: payload.src, figureClasses: "", caption: "" });
    }, [editor]);

    const dialogNewImageUrl = useMemo(() => {
        return (
            <NewImageUrlDialog
                open={openNewImageUrl}
                onClose={() => {
                    setOpenNewImageUrl(false);
                }}
                onConfirm={(data) => {
                    setOpenNewImageUrl(false);
                    onConfirm(data);
                }}
            />
        );
    }, [openNewImageUrl, onConfirm]);


    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isNodeSelection(selection)) {
                    const node = selection.getNodes()[0];
                    if (node) {
                        setEnabled(node.getType() !== "youtube" && node.getType() !== "embed-video" && node.getType() !== "figure");
                    }
                } else {
                    setEnabled(true);
                }
            });
        });
    }, [editor]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                <Grid item>
                    <ToolbarToggleButton
                        // selected={isLink}
                        disabled={!enabled}
                        value='image'
                        label={buttonSetup.icon}
                        title={buttonSetup.title}
                        onClick={(e) => {
                            handleClickToggleButton(e);
                        }}
                    />
                </Grid>
            </Grid>
            {menu}
            {dialogNewImageUrl}
        </Fragment>
    );
}
