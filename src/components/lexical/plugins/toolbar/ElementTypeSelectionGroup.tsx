import { Grid, Menu, MenuItem, Typography } from '@mui/material';
import { $getSelection, $isRangeSelection, $createParagraphNode, LexicalEditor } from 'lexical';
import { $isListNode } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from "@lexical/selection";
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ElementTypeSelectionType, ElementTypeSelectionTypeOptional, ICON_SIZE } from 'src/types';
import ToolbarToggleButton from 'src/components/ui/ToolbarToggleButton';
import Icon from '@mdi/react';
import { mdiFormatParagraph } from '@mdi/js';
import { mdiFormatHeader1 } from '@mdi/js';
import { mdiFormatHeader2 } from '@mdi/js';
import { mdiFormatHeader3 } from '@mdi/js';
import { mdiFormatHeader4 } from '@mdi/js';
import { mdiFormatHeader5 } from '@mdi/js';
import { mdiFormatHeader6 } from '@mdi/js';
import { mdiCommentQuoteOutline } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

export interface IElementTypeSelectionGroupProps {
    editor: LexicalEditor;
    include?: ElementTypeSelectionTypeOptional[];
}

type Setup = Record<ElementTypeSelectionType, { startIcon: JSX.Element, endIcon: JSX.Element, title: string; }>;

const buttonsSetup = {
    paragraph: { startIcon: <Icon path={mdiFormatParagraph} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Normal Style" },
    h1: { startIcon: <Icon path={mdiFormatHeader1} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 1" },
    h2: { startIcon: <Icon path={mdiFormatHeader2} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 2" },
    h3: { startIcon: <Icon path={mdiFormatHeader3} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 3" },
    h4: { startIcon: <Icon path={mdiFormatHeader4} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 4" },
    h5: { startIcon: <Icon path={mdiFormatHeader5} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 5" },
    h6: { startIcon: <Icon path={mdiFormatHeader6} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Heading 6" },
    quote: { startIcon: <Icon path={mdiCommentQuoteOutline} size={ICON_SIZE} />, endIcon: <Icon path={mdiChevronDown} size={ICON_SIZE} />, title: "Quote" }
} as Setup;

const initialState: ElementTypeSelectionType = "paragraph";

export default function ElementTypeSelectionGroup({ editor, include = ["h1", "h2", "h3", "h4", "h5", "h6", "quote"] }: IElementTypeSelectionGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<ElementTypeSelectionType>(initialState);

    const availableTypes: ElementTypeSelectionType[] = useMemo(() => {
        return ["paragraph", ...include];
    }, [include]);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const setElementType = useCallback((type: ElementTypeSelectionType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (type === "paragraph") {
                    $setBlocksType(selection, () => $createParagraphNode());
                    return;
                }
                if (type === "quote") {
                    $setBlocksType(selection, () => $createQuoteNode());
                    return;
                }
                if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
                    $setBlocksType(selection, () => $createHeadingNode(type));
                    return;
                }
            }
        });
        handleClose();
    }, [editor, handleClose]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const anchorNode = selection.anchor.getNode();
                    const element =
                        anchorNode.getKey() === "root"
                            ? anchorNode
                            : anchorNode.getTopLevelElementOrThrow();
                    const elementKey = element.getKey();
                    const elementDOM = editor.getElementByKey(elementKey);
                    if (elementDOM !== null) {
                        if ($isListNode(element)) {
                            // const parentList = $getNearestNodeOfType<ListNode>(
                            //     anchorNode,
                            //     ListNode,
                            // );
                            // const type = parentList
                            //     ? parentList.getListType()
                            //     : element.getListType();
                            // setBlockType(type);
                        } else {
                            const type = $isHeadingNode(element)
                                ? element.getTag()
                                : element.getType();

                            if (availableTypes.includes(type)) {
                                setState(type);
                            }
                        }
                    }
                }
            });
        });
    }, [editor, availableTypes]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="element-type-selection-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableAutoFocusItem
            >
                {availableTypes.map((type) => {
                    return (
                        <MenuItem onClick={() => setElementType(type)} key={type} selected={state === type} sx={{py:.5}}>
                            {<>{buttonsSetup[type].startIcon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorEl, handleClose, setElementType, availableTypes]);

    const toggleButton = useMemo(() => {
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Typography variant='button' sx={{ px: 0.5 }} noWrap>{buttonsSetup[state].title}</Typography>{buttonsSetup[state].endIcon}</>}
                title={buttonsSetup[state].title}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [state, handleClick]);


    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                <Grid>
                    {toggleButton}
                </Grid>
            </Grid>
            {menu}
        </Fragment>

    );
}
