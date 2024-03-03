import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { ICON_SIZE, LinkData } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiLink } from '@mdi/js';
import { getSelectedNode } from "../../utils/getSelectedNode";
import { sanitizeUrl } from "../../utils/url";
import { LinkDialog } from "./link/LinkDialog";
import { $isCustomLinkNode, TOGGLE_CUSTOM_LINK_COMMAND } from "../../nodes/CustomLinkNode";


interface ILinkButtonProps {
    editor: LexicalEditor;
}

type Setup = { icon: JSX.Element, title: string; };

const buttonSetup = { icon: <Icon path={mdiLink} size={ICON_SIZE} />, title: "Insert/Update Link" } as Setup;


export default function CustomLinkButton({ editor }: ILinkButtonProps) {

    const [isLink, setIsLink] = useState<boolean>(false);

    const [linkData, setLinkData] = useState<LinkData>({ url: "", target: "_self", title: "", classes: "" });

    const [isLinkDialog, setIsLinkDialog] = useState<boolean>(false);

    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const handleCloseDialog = useCallback(() => {
        setIsLinkDialog(false);
    }, []);

    const handleDeleteLink = useCallback(() => {
        setIsLinkDialog(false);
        editor.dispatchCommand(TOGGLE_CUSTOM_LINK_COMMAND, null);
    }, [editor]);

    const handleConfirmLink = useCallback((linkData: LinkData) => {
        setLinkData({ ...linkData });
        setIsLinkDialog(false);
        editor.dispatchCommand(TOGGLE_CUSTOM_LINK_COMMAND, { url: sanitizeUrl(linkData.url), target: linkData.target, title: linkData.title, classes: linkData.classes });
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
            if ($isCustomLinkNode(parent)) {
                setIsLink(true);
                setLinkData({ url: parent.getURL(), target: parent.getTarget(), title: parent.getTitle(), classes: parent.getClasses() });
            } else if ($isCustomLinkNode(node)) {
                setIsLink(true);
                setLinkData({ url: node.getURL(), target: node.getTarget(), title: node.getTitle(), classes: node.getClasses() });
            } else {
                setIsLink(false);
            }
            const anchor = selection.anchor;
            const focus = selection.focus;
            setIsDisabled(anchor.key === focus.key && anchor.offset === focus.offset);
        } else {
            setIsDisabled(true);
        }
    }, []);

    const insertLink = useCallback(() => {
        if (!isLink) {
            setLinkData({ url: sanitizeUrl('https://'), target: "_self", title: "", classes: "" });
        }
        setIsLinkDialog(true);
    }, [isLink]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateButton();
            });
        });
    }, [editor, updateButton]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
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
