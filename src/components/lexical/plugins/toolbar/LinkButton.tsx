import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiLink } from '@mdi/js';
import { getSelectedNode } from "../../utils/getSelectedNode";
import { sanitizeUrl } from "../../utils/url";
import { LinkDialog } from "./link/LinkDialog";


interface ILinkButtonProps {
    editor: LexicalEditor;
}

type Setup = { icon: JSX.Element, title: string; };

const buttonSetup = { icon: <Icon path={mdiLink} size={ICON_SIZE} />, title: "Insert/Update Link" } as Setup;


export default function LinkButton({ editor }: ILinkButtonProps) {

    const [isLink, setIsLink] = useState<boolean>(false);

    const [linkUrl, setLinkUrl] = useState<string>("");

    const [isLinkDialog, setIsLinkDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setIsLinkDialog(false);
    }, []);

    const handleDeleteLink = useCallback(() => {
        setIsLinkDialog(false);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }, [editor]);


    const linkDialog = useMemo(() => {
        return (
            <LinkDialog open={isLinkDialog} url={linkUrl} onClose={handleCloseDialog} onConfirm={handleCloseDialog} onLinkDelete={handleDeleteLink} />
        );
    }, [linkUrl, isLinkDialog, handleCloseDialog, handleDeleteLink]);

    const linkPlugin = useMemo(() => {
        return <LinkPlugin />;
    }, []);

    const updateButton = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            console.log($isLinkNode(parent));
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, []);

    const insertLink = useCallback(() => {
        if (!isLink) {
            setIsLinkDialog(true);
            setLinkUrl('https://');
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
        } else {
            setIsLinkDialog(true);
            //            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND, () => {
                updateButton();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, updateButton]);

    return (
        <Fragment>
            {linkPlugin}
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                <Grid item>
                    <ToolbarToggleButton
                        selected={isLink}
                        value='link'
                        label={buttonSetup.icon}
                        title={buttonSetup.title}
                        onClick={insertLink}
                    />
                </Grid>
            </Grid>
            {linkDialog}
        </Fragment>
    );
}
