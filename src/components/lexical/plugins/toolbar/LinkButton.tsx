import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { ICON_SIZE, LinkData } from "src/types";
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

    const [linkData, setLinkData] = useState<LinkData>({ url: "", target: "_self", title: "" });

    const [isLinkDialog, setIsLinkDialog] = useState<boolean>(false);

    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const handleCloseDialog = useCallback(() => {
        setIsLinkDialog(false);
    }, []);

    const handleDeleteLink = useCallback(() => {
        setIsLinkDialog(false);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }, [editor]);

    const handleConfirmLink = useCallback((linkData: LinkData) => {
        setLinkData({ ...linkData });
        setIsLinkDialog(false);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: sanitizeUrl(linkData.url), target: linkData.target, title: linkData.title });
    }, [editor]);

    const linkDialog = useMemo(() => {
        return (
            <LinkDialog open={isLinkDialog} data={linkData} onClose={handleCloseDialog} onConfirm={handleConfirmLink} onLinkDelete={handleDeleteLink} />
        );
    }, [linkData, isLinkDialog, handleCloseDialog, handleDeleteLink, handleConfirmLink]);

    const updateButton = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent)) {
                setIsLink(true);
                setLinkData({ url: parent.getURL(), target: parent.getTarget(), title: parent.getTitle() });
            } else if ($isLinkNode(node)) {
                setIsLink(true);
                setLinkData({ url: node.getURL(), target: node.getTarget(), title: node.getTitle() });
            } else {
                setIsLink(false);
            }
            const anchor = selection.anchor;
            const focus = selection.focus;
            setIsDisabled(anchor.key === focus.key && anchor.offset === focus.offset);
        }
    }, []);

    const insertLink = useCallback(() => {
        if (!isLink) {
            setLinkData({ url: sanitizeUrl('https://'), target: "_self", title: "" });
        }
        setIsLinkDialog(true);
    }, [isLink]);

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
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                <Grid item>
                    <ToolbarToggleButton
                        selected={isLink}
                        disabled={isDisabled && !isLink}
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
