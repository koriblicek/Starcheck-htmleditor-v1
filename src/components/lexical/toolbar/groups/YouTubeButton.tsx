import { Fragment, useCallback, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { LexicalEditor } from "lexical";
import { ICON_SIZE } from "src/types";
import { YouTubeDialog } from "./youtube/YouTubeDialog";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiYoutube } from '@mdi/js';
import { INSERT_YOUTUBE_COMMAND } from "../../plugins/YouTubePlugin";

interface IYouTubeButtonProps {
    editor: LexicalEditor;
}

type Setup = { icon: JSX.Element, title: string; };

const buttonSetup = { icon: <Icon path={mdiYoutube} size={ICON_SIZE} />, title: "Embed YouTube Video" } as Setup;


export default function YouTubeButton({ editor }: IYouTubeButtonProps) {

    const [isYouTubeDialog, setIsYouTubeDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setIsYouTubeDialog(false);
    }, []);

    const handleConfirmLink = useCallback((link: string) => {
        setIsYouTubeDialog(false);
        editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, link);
    }, [editor]);

    const youTubeDialog = useMemo(() => {
        return (
            <YouTubeDialog open={isYouTubeDialog} onClose={handleCloseDialog} onConfirm={handleConfirmLink} />
        );
    }, [isYouTubeDialog, handleCloseDialog, handleConfirmLink]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                <Grid item>
                    <ToolbarToggleButton
                        value='youtube'
                        label={buttonSetup.icon}
                        title={buttonSetup.title}
                        onClick={() => setIsYouTubeDialog(true)}
                    />
                </Grid>
            </Grid>
            {youTubeDialog}
        </Fragment>
    );
}
