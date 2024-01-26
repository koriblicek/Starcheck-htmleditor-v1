import { useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { $getSelection, $isElementNode, $isRangeSelection, ElementFormatType, FORMAT_ELEMENT_COMMAND, LexicalEditor, LexicalNode } from "lexical";
import { ICON_SIZE, RecordElementFormatType } from "src/types";
import { getSelectedNode } from "src/components/lexical/utils/getSelectedNode";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatAlignLeft } from '@mdi/js';
import { mdiFormatAlignCenter } from '@mdi/js';
import { mdiFormatAlignRight } from '@mdi/js';
import { mdiFormatAlignJustify } from '@mdi/js';
import { mdiCloseCircleOutline } from '@mdi/js';


interface IFormattingElementButtonsGroupProps {
    editor: LexicalEditor;
    include?: ElementFormatType[];
}

type Setup = Record<ElementFormatType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    "": { icon: <Icon path={mdiCloseCircleOutline} size={ICON_SIZE} />, title: "Clear Alignment" },
    start: { icon: <Icon path={mdiFormatAlignLeft} size={ICON_SIZE} />, title: "Align Start" },
    left: { icon: <Icon path={mdiFormatAlignLeft} size={ICON_SIZE} />, title: "Align Left" },
    center: { icon: <Icon path={mdiFormatAlignCenter} size={ICON_SIZE} />, title: "Align Center" },
    end: { icon: <Icon path={mdiFormatAlignRight} size={ICON_SIZE} />, title: "Align End" },
    right: { icon: <Icon path={mdiFormatAlignRight} size={ICON_SIZE} />, title: "Align Right" },
    justify: { icon: <Icon path={mdiFormatAlignJustify} size={ICON_SIZE} />, title: "Justify" }
} as Setup;

const initialState: RecordElementFormatType = { "": false, start: false, left: false, center: false, end: false, right: false, justify: false };

export default function FormattingElementButtonsGroup({ editor, include = ['left', 'center', 'right', 'justify', ''] }: IFormattingElementButtonsGroupProps) {
    const [state, setState] = useState<RecordElementFormatType>(initialState);

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

    return (
        <Grid container columnGap={.5}>
            {include.map((type) => (
                <Grid item key={type}>
                    <ToolbarToggleButton
                        selected={type === '' ? false : state[type]}
                        value={type}
                        icon={buttonsSetup[type].icon}
                        title={buttonsSetup[type].title}
                        onClick={() => dispatchFormatElementCommand(type)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
