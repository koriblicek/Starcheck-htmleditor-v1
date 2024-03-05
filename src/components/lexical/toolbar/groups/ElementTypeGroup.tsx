import { Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { $getSelection, $isRangeSelection, $createParagraphNode, LexicalEditor } from 'lexical';
import { ListNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ElementReadOnlyType, ElementTypeType, ICON_SIZE } from 'src/types';
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
import { mdiFormatListBulletedSquare } from '@mdi/js';
import { mdiFormatListNumbered } from '@mdi/js';
import { mdiFormatListCheckbox } from '@mdi/js';
import { mdiYoutube } from '@mdi/js';
import { mdiVideoBox } from '@mdi/js';
import { mdiHomeCircleOutline } from '@mdi/js';
import { mdiImageOutline } from '@mdi/js';
import { mdiFormatFloatNone } from '@mdi/js';
import { mdiMinus } from '@mdi/js';

export interface IElementTypeGroupProps {
    editor: LexicalEditor;
    buttons?: ElementTypeType[];
    groupedButtons?: ElementTypeType[];
    fixedWidth?: string;
}

type Setup = Record<ElementTypeType | ElementReadOnlyType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    paragraph: { icon: <Icon path={mdiFormatParagraph} size={ICON_SIZE} />, title: "Normal Paragraph" },
    h1: { icon: <Icon path={mdiFormatHeader1} size={ICON_SIZE} />, title: "Heading 1" },
    h2: { icon: <Icon path={mdiFormatHeader2} size={ICON_SIZE} />, title: "Heading 2" },
    h3: { icon: <Icon path={mdiFormatHeader3} size={ICON_SIZE} />, title: "Heading 3" },
    h4: { icon: <Icon path={mdiFormatHeader4} size={ICON_SIZE} />, title: "Heading 4" },
    h5: { icon: <Icon path={mdiFormatHeader5} size={ICON_SIZE} />, title: "Heading 5" },
    h6: { icon: <Icon path={mdiFormatHeader6} size={ICON_SIZE} />, title: "Heading 6" },
    bullet: { icon: <Icon path={mdiFormatListBulletedSquare} size={ICON_SIZE} />, title: "Bullet List" },
    number: { icon: <Icon path={mdiFormatListNumbered} size={ICON_SIZE} />, title: "Numbered List" },
    check: { icon: <Icon path={mdiFormatListCheckbox} size={ICON_SIZE} />, title: "Check List" },
    quote: { icon: <Icon path={mdiCommentQuoteOutline} size={ICON_SIZE} />, title: "Quote" },
    youtube: { icon: <Icon path={mdiYoutube} size={ICON_SIZE} />, title: "Youtube Video" },
    "embed-video": { icon: <Icon path={mdiVideoBox} size={ICON_SIZE} />, title: "Embed Video" },
    "inline-image": { icon: <Icon path={mdiImageOutline} size={ICON_SIZE} />, title: "Inline Image" },
    figure: { icon: <Icon path={mdiImageOutline} size={ICON_SIZE} />, title: "Figure" },
    "div-clear-both": { icon: <Icon path={mdiFormatFloatNone} size={ICON_SIZE} />, title: "DIV Clear Both" },
    "horizontal-rule": { icon: <Icon path={mdiMinus} size={ICON_SIZE} />, title: "Horizontal Rule" },
    root: { icon: <Icon path={mdiHomeCircleOutline} size={ICON_SIZE} />, title: "Root" }
} as Setup;

const initialState: ElementTypeType = "paragraph";

export default function ElementTypeGroup({ editor, buttons = [], groupedButtons = [], fixedWidth = 'auto' }: IElementTypeGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<ElementTypeType | ElementReadOnlyType>(initialState);

    const handleClick = useCallback((event: React.MouseEvent) => {
        if (groupedButtons.length !== 0){
            setAnchorEl(event.currentTarget);
        }
    }, [groupedButtons]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const setElementType = useCallback((type: ElementTypeType) => {
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
                if (type === "bullet") {
                    if (state !== "bullet") {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    }
                    return;
                }
                if (type === "number") {
                    if (state !== "number") {
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    }
                    return;
                }
                if (type === "check") {
                    if (state !== "check") {
                        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    }
                    return;
                }
                if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
                    $setBlocksType(selection, () => $createHeadingNode(type));
                    return;
                }
            } else {
                //console.log(selection?.getNodes());
                //setState(initialState);
            }
        });
        handleClose();
    }, [editor, handleClose, state]);

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
                            // is list?
                            const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
                            const type = parentList ? parentList.getListType() : element.getListType();
                            setState(type);
                        } else {
                            //is heading?
                            const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                            // if (availableGroupedTypes.includes(type)) {
                            setState(type);
                            // }
                        }
                    }
                } else {
                    const node = selection?.getNodes()[0];
                    if (node) {
                        setState(node.getType() as ElementTypeType | ElementReadOnlyType);
                    }
                }
            });
        });
    }, [editor]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="element-type-selection-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableAutoFocusItem
            >
                {groupedButtons.map((type) => {
                    return (
                        <MenuItem onClick={() => setElementType(type)} key={type} selected={state === type} sx={{ py: .5 }}>
                            {<>{buttonsSetup[type].icon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}


            </Menu>
        );
    }, [state, anchorEl, handleClose, setElementType, groupedButtons]);

    const toggleButton = useMemo(() => {
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', width: `${fixedWidth}`, justifyContent: 'space-between' }}>
                        <Typography variant='button' sx={{ px: 0.5, overflow: 'clip' }} noWrap>
                            {Object.keys(state) ? buttonsSetup[state].title : "More Styles"}
                        </Typography>
                        {(groupedButtons.length !== 0) && <Icon path={mdiChevronDown} size={ICON_SIZE} />}
                    </Box>
                }
                title={buttonsSetup[state].title}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [state, fixedWidth, handleClick, groupedButtons]);


    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {buttons.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={state === type}
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => setElementType(type)}
                        />
                    </Grid>
                ))}
                <Grid>
                    {toggleButton}
                </Grid>
            </Grid>
            {menu}
        </Fragment>

    );
}
