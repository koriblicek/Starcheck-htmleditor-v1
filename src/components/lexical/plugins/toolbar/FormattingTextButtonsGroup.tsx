import { useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor, TextFormatType } from "lexical";
import { ICON_SIZE, RecordTextFormatType } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatBold } from '@mdi/js';
import { mdiFormatItalic } from '@mdi/js';
import { mdiFormatUnderline } from '@mdi/js';
import { mdiFormatStrikethrough } from '@mdi/js';
import { mdiFormatSubscript } from '@mdi/js';
import { mdiFormatSuperscript } from '@mdi/js';
import { mdiCodeTags } from '@mdi/js';
import { mdiFormatColorHighlight } from '@mdi/js';

interface IFormattingTextButtonsGroupProps {
    editor: LexicalEditor;
    include?: TextFormatType[];
}

type Setup = Record<TextFormatType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    bold: { icon: <Icon path={mdiFormatBold} size={ICON_SIZE} />, title: "Bold (Ctrl+B)" },
    italic: { icon: <Icon path={mdiFormatItalic} size={ICON_SIZE} />, title: "Italic (Ctrl+I)" },
    underline: { icon: <Icon path={mdiFormatUnderline} size={ICON_SIZE} />, title: "Underline (Ctrl+U)" },
    strikethrough: { icon: <Icon path={mdiFormatStrikethrough} size={ICON_SIZE} />, title: "Strikethrough" },
    subscript: { icon: <Icon path={mdiFormatSubscript} size={ICON_SIZE} />, title: "Subscript" },
    superscript: { icon: <Icon path={mdiFormatSuperscript} size={ICON_SIZE} />, title: "Superscript" },
    code: { icon: <Icon path={mdiCodeTags} size={ICON_SIZE} />, title: "Code" },
    highlight: { icon: <Icon path={mdiFormatColorHighlight} size={ICON_SIZE} />, title: "Highlight" },
} as Setup;

const initialState: RecordTextFormatType = { bold: false, italic: false, underline: false, subscript: false, superscript: false, strikethrough: false, code: false, highlight: false };

export default function FormattingTextButtonsGroup({ editor, include = ['bold', 'italic', 'underline'] }: IFormattingTextButtonsGroupProps) {
    const [state, setState] = useState<RecordTextFormatType>(initialState);

    const updateFormatButtons = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setState({
                bold: selection.hasFormat("bold"),
                italic: selection.hasFormat("italic"),
                underline: selection.hasFormat("underline"),
                strikethrough: selection.hasFormat("strikethrough"),
                subscript: selection.hasFormat("subscript"),
                superscript: selection.hasFormat("superscript"),
                code: selection.hasFormat("code"),
                highlight: selection.hasFormat("highlight")
            } as RecordTextFormatType);
        } else {
            setState(initialState);
        }
    }, [editor]);

    const dispatchFormatTextCommand = useCallback((type: TextFormatType) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateFormatButtons();
            });
        });
    }, [editor, updateFormatButtons]);

    return (
        <Grid container columnGap={.5}>
            {include.map((type) => (
                <Grid item key={type}>
                    <ToolbarToggleButton
                        selected={state[type]}
                        value={type}
                        icon={buttonsSetup[type].icon}
                        title={buttonsSetup[type].title}
                        onClick={() => dispatchFormatTextCommand(type)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
