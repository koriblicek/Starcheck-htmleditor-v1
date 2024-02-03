import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, FORMAT_TEXT_COMMAND, LexicalEditor, PointType, TextFormatType } from "lexical";
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { ClearTextFormatType, ICON_SIZE } from "src/types";
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
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
import { mdiChevronDown } from '@mdi/js';
import { mdiFormatLetterCase } from '@mdi/js';
import { mdiFormatClear } from '@mdi/js';

interface ITextFormattingGroupProps {
    editor: LexicalEditor;
    buttons?: (TextFormatType | ClearTextFormatType)[];
    groupedButtons?: (TextFormatType | ClearTextFormatType)[];
}
type RecordTextFormatType = Record<TextFormatType | ClearTextFormatType, boolean>;

type Setup = Record<(TextFormatType | ClearTextFormatType), { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    bold: { icon: <Icon path={mdiFormatBold} size={ICON_SIZE} />, title: "Bold (Ctrl+B)" },
    italic: { icon: <Icon path={mdiFormatItalic} size={ICON_SIZE} />, title: "Italic (Ctrl+I)" },
    underline: { icon: <Icon path={mdiFormatUnderline} size={ICON_SIZE} />, title: "Underline (Ctrl+U)" },
    strikethrough: { icon: <Icon path={mdiFormatStrikethrough} size={ICON_SIZE} />, title: "Strikethrough" },
    subscript: { icon: <Icon path={mdiFormatSubscript} size={ICON_SIZE} />, title: "Subscript" },
    superscript: { icon: <Icon path={mdiFormatSuperscript} size={ICON_SIZE} />, title: "Superscript" },
    code: { icon: <Icon path={mdiCodeTags} size={ICON_SIZE} />, title: "Code" },
    highlight: { icon: <Icon path={mdiFormatColorHighlight} size={ICON_SIZE} />, title: "Highlight" },
    clear_text_formatting: { icon: <Icon path={mdiFormatClear} size={ICON_SIZE} />, title: "Clear Text Formatting" },
} as Setup;

const initialState: RecordTextFormatType = { bold: false, italic: false, underline: false, subscript: false, superscript: false, strikethrough: false, code: false, highlight: false, clear_text_formatting: false };

export default function TextFormattingGroup({ editor, buttons = ['bold', 'italic', 'underline'], groupedButtons = [] }: ITextFormattingGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<RecordTextFormatType>(initialState);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const updateFormatButtons = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const focus = selection.focus;
            setState({
                bold: selection.hasFormat("bold"),
                italic: selection.hasFormat("italic"),
                underline: selection.hasFormat("underline"),
                strikethrough: selection.hasFormat("strikethrough"),
                subscript: selection.hasFormat("subscript"),
                superscript: selection.hasFormat("superscript"),
                code: selection.hasFormat("code"),
                highlight: selection.hasFormat("highlight"),
                clear_text_formatting: !(anchor.key === focus.key && anchor.offset === focus.offset)
            } as RecordTextFormatType);
        } else {
            setState(initialState);
        }
    }, [editor]);

    const dispatchFormatTextCommand = useCallback((type: TextFormatType) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    }, [editor]);

    const dispatchClearFormatTextCommand = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const nodes = selection.getNodes();

                // if (anchor.key === focus.key && anchor.offset === focus.offset) {
                //     return;
                // }
                nodes.forEach((node, idx) => {
                    // We split the first and last node by the selection
                    // So that we don't format unselected text inside those nodes
                    if ($isTextNode(node)) {
                        //if anchor key is higher then focus key - it means user selected text from back - switch them
                        let left: PointType;
                        let right: PointType;
                        if ((anchor.key > focus.key) || (anchor.key === focus.key && anchor.offset > focus.offset)) {
                            left = focus;
                            right = anchor;
                        } else {
                            left = anchor;
                            right = focus;
                        }
                        // Use a separate variable to ensure TS does not lose the refinement
                        let textNode = node;
                        if (idx === 0 && left.offset !== 0) {
                            textNode = textNode.splitText(left.offset)[1] || textNode;
                        }
                        if (idx === nodes.length - 1) {
                            textNode = textNode.splitText(right.offset)[0] || textNode;
                        }

                        if (textNode.__style !== '') {
                            textNode.setStyle('');
                        }
                        if (textNode.__format !== 0) {
                            textNode.setFormat(0);
                            $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
                        }
                        node = textNode;
                    } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
                        node.replace($createParagraphNode(), true);
                    } else if ($isDecoratorBlockNode(node)) {
                        node.setFormat('');
                    }
                });
            }
        });
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateFormatButtons();
            });
        });
    }, [editor, updateFormatButtons]);

    const toggleButton = useMemo(() => {
        if (groupedButtons.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Icon path={mdiFormatLetterCase} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                title={'Formatting Options'}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [groupedButtons, handleClick]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="formatting-text-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableAutoFocusItem
            >
                {groupedButtons.map((type) => {
                    return (
                        <MenuItem onClick={() => {
                            if (type === "clear_text_formatting") {
                                dispatchClearFormatTextCommand();
                            }
                            else {
                                dispatchFormatTextCommand(type);
                            }
                            handleClose();
                        }} key={type}
                            selected={(type === "clear_text_formatting") ? false : state[type]}
                            disabled={(type === "clear_text_formatting") ? !state[type] : false}
                            sx={{ py: .5 }}>
                            {<>{buttonsSetup[type].icon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorEl, handleClose, dispatchFormatTextCommand, groupedButtons, dispatchClearFormatTextCommand]);

    return (
        <>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width="auto">
                {buttons.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={(type === "clear_text_formatting") ? false : state[type]}
                            disabled={(type === "clear_text_formatting") ? !state[type] : false}
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => {
                                if (type === "clear_text_formatting") {
                                    dispatchClearFormatTextCommand();
                                }
                                else {
                                    dispatchFormatTextCommand(type);
                                }
                            }}
                        />
                    </Grid>
                ))}
                {toggleButton &&
                    <Grid item>
                        {toggleButton}
                    </Grid>
                }
            </Grid>
            {menu}
        </>
    );
}
