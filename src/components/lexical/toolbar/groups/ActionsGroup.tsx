import { Fragment, useCallback, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { LexicalEditor, CLEAR_EDITOR_COMMAND } from "lexical";
import { ActionsType, ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import { ClearEditorDialog } from "./actions/ClearEditorDialog";
import { mdiEyeOutline } from '@mdi/js';
import { PreviewDialog } from "./actions/PreviewDialog";
import { $generateHtmlFromNodes } from '@lexical/html';

interface IActionsGroupProps {
    editor: LexicalEditor;
    include?: ActionsType[];
}

type Setup = Record<ActionsType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    clear: { icon: <Icon path={mdiTrashCanOutline} size={ICON_SIZE} />, title: "Clear Editor" },
    preview: { icon: <Icon path={mdiEyeOutline} size={ICON_SIZE} />, title: "Preview" }
} as Setup;

export default function ActionsGroup({ editor, include = ['preview', 'clear'] }: IActionsGroupProps) {

    const [isClearOpen, setIsClearOpen] = useState<boolean>(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [previewHtml, setPreviewHtml] = useState<string>("");

    const dispatchActionsCommand = useCallback((type: ActionsType) => {
        switch (type) {
            case 'clear':
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                break;
        }
    }, [editor]);

    const handleToggleClick = useCallback((type: ActionsType) => {
        if (type === "clear") {
            setIsClearOpen(true);
        }
        if (type === "preview") {
            setIsPreviewOpen(true);
            const editorState = editor.getEditorState();
            let htmlString = '';
            editorState.read(() => {
                htmlString = $generateHtmlFromNodes(editor);
            });
            setPreviewHtml(htmlString);
        }
    }, [editor]);

    const onClose = useCallback(() => {
        setIsClearOpen(false);
        setIsPreviewOpen(false);
    }, []);

    const onClearConfirmed = useCallback((confirm: boolean) => {
        if (confirm) {
            dispatchActionsCommand("clear");
        }
        onClose();
    }, [dispatchActionsCommand, onClose]);

    const clearDialog = useMemo(() => {
        return (
            <ClearEditorDialog open={isClearOpen} onAction={onClearConfirmed} />
        );
    }, [isClearOpen, onClearConfirmed]);

    const previewDialog = useMemo(() => {
        return (
            <PreviewDialog open={isPreviewOpen} onClose={onClose} htmlData={previewHtml} />
        );
    }, [isPreviewOpen, previewHtml, onClose]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                {include.map((type) => (
                    <Grid item key={type} sx={{ backgroundColor: 'white' }}>
                        <ToolbarToggleButton
                            // selected={true}
                            color="standard"
                            value={type}
                            size="small"
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => handleToggleClick(type)}
                        />
                    </Grid>
                ))}
            </Grid>
            {clearDialog}
            {previewDialog}
        </Fragment>
    );
}
