import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelection, $isElementNode, $isNodeSelection, $isRangeSelection, ElementFormatType, FORMAT_ELEMENT_COMMAND, LexicalEditor, LexicalNode } from "lexical";
import { ElementAlignmentType, ICON_SIZE } from "src/types";
import { getSelectedNode } from "src/components/lexical/utils/getSelectedNode";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatAlignLeft } from '@mdi/js';
import { mdiFormatAlignCenter } from '@mdi/js';
import { mdiFormatAlignRight } from '@mdi/js';
import { mdiFormatAlignJustify } from '@mdi/js';
import { mdiEraser } from '@mdi/js';
import { mdiDotsVertical } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

interface IElementAlignmentGroupProps {
    editor: LexicalEditor;
    buttons?: ElementAlignmentType[];
    groupedButtons?: ElementAlignmentType[];
}
export type RecordElementAlignmentType = Record<ElementAlignmentType, boolean>;


type Setup = Record<ElementAlignmentType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    clear_alignment: { icon: <Icon path={mdiEraser} size={ICON_SIZE} />, title: "Clear Alignment" },
    start: { icon: <Icon path={mdiFormatAlignLeft} size={ICON_SIZE} />, title: "Align Start" },
    left: { icon: <Icon path={mdiFormatAlignLeft} size={ICON_SIZE} />, title: "Align Left" },
    center: { icon: <Icon path={mdiFormatAlignCenter} size={ICON_SIZE} />, title: "Align Center" },
    end: { icon: <Icon path={mdiFormatAlignRight} size={ICON_SIZE} />, title: "Align End" },
    right: { icon: <Icon path={mdiFormatAlignRight} size={ICON_SIZE} />, title: "Align Right" },
    justify: { icon: <Icon path={mdiFormatAlignJustify} size={ICON_SIZE} />, title: "Justify" }
} as Setup;

const initialState: RecordElementAlignmentType = { clear_alignment: false, start: false, left: false, center: false, end: false, right: false, justify: false };

export default function ElementAlignmentGroup({ editor, buttons = [], groupedButtons = [] }: IElementAlignmentGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<RecordElementAlignmentType>(initialState);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const updateFormatButtons = useCallback(() => {
        editor.update(() => {
            //TODO is this really needed?
            if (editor.isComposing()) return;
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = getSelectedNode(selection);
                const parent = node.getParent();

                let matchingParent: LexicalNode | undefined | null;

                const d =
                    $isElementNode(matchingParent)
                        ? matchingParent.getFormatType()
                        : $isElementNode(node)
                            ? node.getFormatType()
                            : parent?.getFormatType();
                setState({ ...initialState, [d]: true });
            } else {
                if ($isNodeSelection(selection) && selection.getNodes().length === 1) {
                    const n = selection.getNodes()[0];
                    if ($isDecoratorBlockNode(n)) {
                        const ft = n.__format;
                        setState({ ...initialState, [ft]: true });
                    }
                }
            }
        });
    }, [editor]);

    const dispatchFormatElementCommand = useCallback((type: ElementFormatType) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updateFormatButtons();
        });
    }, [editor, updateFormatButtons]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="element-alignment-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableAutoFocusItem
            >
                {groupedButtons.map((type) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                if (type === "clear_alignment") {
                                    dispatchFormatElementCommand("");
                                } else {
                                    dispatchFormatElementCommand(type);
                                }
                                handleClose();
                            }}
                            key={type}
                            selected={type === 'clear_alignment' ? false : state[type]}
                            sx={{ py: .5 }}>
                            {<>{buttonsSetup[type].icon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorEl, handleClose, dispatchFormatElementCommand, groupedButtons]);

    const toggleButton = useMemo(() => {
        if (groupedButtons.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Icon path={mdiDotsVertical} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                title={'Alignment Options'}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [groupedButtons, handleClick]);

    return (
        <>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {buttons.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={type === 'clear_alignment' ? false : state[type]}
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => {
                                if (type !== "clear_alignment") {
                                    dispatchFormatElementCommand(type);
                                } else {
                                    dispatchFormatElementCommand("");
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
