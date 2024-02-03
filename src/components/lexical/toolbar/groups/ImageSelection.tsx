import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { LexicalEditor } from "lexical";
import { ICON_SIZE, NewImagePayload } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiImageOutline } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import { INSERT_INLINE_IMAGE_COMMAND } from "../../plugins/InlineImagePlugin";
import { NewImageUrlDialog } from "./image/NewImageUrlDialog";


interface IImageSelectionProps {
    editor: LexicalEditor;
}

type Setup = { icon: JSX.Element, title: string; };

const buttonSetup = { icon: <><Icon path={mdiImageOutline} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>, title: "Insert Image" } as Setup;

export default function ImageSelection({ editor }: IImageSelectionProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [openNewImageUrl, setOpenNewImageUrl] = useState<boolean>(false);

    // const handleClickToggleButton = useCallback((event: React.MouseEvent) => {
    //     setAnchorEl(event.currentTarget);
    // }, []);

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
                    {<Typography variant='subtitle1' sx={{ px: 0.5 }}>URL</Typography>}
                </MenuItem>
            </Menu>
        );
    }, [anchorEl, handleCloseMenu]);

    const onConfirm = useCallback((payload: NewImagePayload) => {
        editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, { src: payload.src });
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
    }, [editor]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                <Grid item>
                    <ToolbarToggleButton
                        // selected={isLink}
                        // disabled={isDisabled && !isLink}
                        value='image'
                        label={buttonSetup.icon}
                        title={buttonSetup.title}
                        onClick={() => {
                            //TODO change back
                            onConfirm({ src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Fronalpstock_big.jpg/800px-Fronalpstock_big.jpg" });
                            //handleClickToggleButton(e);
                        }}
                    />
                </Grid>
            </Grid>
            {menu}
            {dialogNewImageUrl}
        </Fragment>
    );
}
