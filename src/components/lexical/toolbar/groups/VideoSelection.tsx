import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { ICON_SIZE, NewEmbedVideoPayload, VideoType } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { mdiVideoBox } from '@mdi/js';
import { mdiYoutube } from '@mdi/js';
import { mdiVideo } from '@mdi/js';
import { INSERT_YOUTUBE_COMMAND } from "../../plugins/YouTubePlugin";
import { YouTubeDialog } from "./youtube/YouTubeDialog";
import { INSERT_EMBED_VIDEO_COMMAND } from "../../plugins/EmbedVideoPlugin";
import { EmbedVideoDialog } from "./embedvideo/EmbedVideoDialog";





interface IVideoSelectionProps {
    editor: LexicalEditor;
}

type Setup = Record<VideoType, { icon: JSX.Element, title: string; }>;

const buttonSetup = {
    youtube: { icon: <Icon path={mdiYoutube} size={ICON_SIZE} />, title: "YouTube video" },
    "embed-video": { icon: <Icon path={mdiVideoBox} size={ICON_SIZE} />, title: "Embed Video" }
} as Setup;

export default function VideoSelection({ editor }: IVideoSelectionProps) {

    const [enabled, setEnabled] = useState<boolean>(true);
    const [isYouTubeDialog, setIsYouTubeDialog] = useState<boolean>(false);
    const [isEmbedVideoDialog, setIsEmbedVideoDialog] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const handleMenuSelection = useCallback((type: string) => {
        switch (type) {
            case "youtube":
                setIsYouTubeDialog(true);
                break;
            case "embed-video":
                setIsEmbedVideoDialog(true);
                break;
        }
        setAnchorEl(null);
    }, []);

    const handleClickToggleButton = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const menu = useMemo(() => {
        return (
            <Menu
                id="video-source-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                disableAutoFocusItem
            >
                {Object.keys(buttonSetup).map((key) => {
                    return (
                        <MenuItem
                            key={key}
                            onClick={() => {
                                handleMenuSelection(key);
                            }}
                            selected={false}
                            sx={{ py: 0 }}
                        >
                            {<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonSetup[key as VideoType].title}</Typography>}
                        </MenuItem>
                    );
                })}
            </Menu >
        );
    }, [anchorEl, handleCloseMenu, handleMenuSelection]);

    const handleCloseYouTubeDialog = useCallback(() => {
        setIsYouTubeDialog(false);
    }, []);

    const handleConfirmYouTubeLink = useCallback((link: string) => {
        handleCloseYouTubeDialog();
        editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, link);
    }, [editor, handleCloseYouTubeDialog]);

    const youTubeDialog = useMemo(() => {
        return (
            <YouTubeDialog open={isYouTubeDialog} onClose={handleCloseYouTubeDialog} onConfirm={handleConfirmYouTubeLink} />
        );
    }, [isYouTubeDialog, handleCloseYouTubeDialog, handleConfirmYouTubeLink]);

    const handleCloseEmbedVideoDialog = useCallback(() => {
        setIsEmbedVideoDialog(false);
    }, []);

    const handleConfirmEmbedVideoLink = useCallback((embedVideoData: NewEmbedVideoPayload) => {
        handleCloseEmbedVideoDialog();
        editor.dispatchCommand(INSERT_EMBED_VIDEO_COMMAND, {
            videoUrl: embedVideoData.videoUrl,
            posterUrl: embedVideoData.posterUrl
        });
    }, [editor, handleCloseEmbedVideoDialog]);

    const embedVideoDialog = useMemo(() => {
        return (
            <EmbedVideoDialog open={isEmbedVideoDialog} onClose={handleCloseEmbedVideoDialog} onConfirm={handleConfirmEmbedVideoLink} />
        );
    }, [isEmbedVideoDialog, handleCloseEmbedVideoDialog, handleConfirmEmbedVideoLink]);



    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                if (editor.isComposing()) return;
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    setEnabled(true);
                } else {
                    setEnabled(false);
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
                        value='video'
                        label={<><Icon path={mdiVideo} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                        title='Insert Video'
                        onClick={(e) => {
                            handleClickToggleButton(e);
                        }}
                    />
                </Grid>
            </Grid>
            {menu}
            {youTubeDialog}
            {embedVideoDialog}
        </Fragment>
    );
}
