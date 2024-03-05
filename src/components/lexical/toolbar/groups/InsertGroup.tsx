import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { ICON_SIZE, InsertType } from "src/types";
import { mdiChevronDown } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiMinus } from '@mdi/js';
import { mdiFormatFloatNone } from '@mdi/js';
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { INSERT_DIV_CLEAR_BOTH_COMMAND } from "../../plugins/DivClearBothPlugin";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "../../plugins/HorizontalRulePlugin";

interface IInsertGroupProps {
    editor: LexicalEditor;
    buttons?: InsertType[];
    groupedButtons?: InsertType[];
}


type RecordInsertType = Record<InsertType, boolean>;

type Setup = Record<InsertType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    clear_both: { icon: <Icon path={mdiFormatFloatNone} size={1} />, title: "DIV clear:both" },
    hr: { icon: <Icon path={mdiMinus} size={ICON_SIZE} />, title: "Horizontal Rule" }
} as Setup;


const initialState: RecordInsertType = { clear_both: false, hr: false };

export default function InsertGroup({ editor, buttons = [], groupedButtons = [] }: IInsertGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<RecordInsertType>(initialState);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const updateInsertButtons = useCallback(() => {
        //TODO is this really needed?
        if (editor.isComposing()) return;
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setState({
                clear_both: true,
                hr: true
            } as RecordInsertType);
        } else {
            setState(initialState);
        }
    }, [editor]);

    const dispatchActionsCommand = useCallback((type: InsertType) => {
        switch (type) {
            case 'clear_both':
                editor.dispatchCommand(INSERT_DIV_CLEAR_BOTH_COMMAND, { divClearBothClasses: "cb" });
                break;
            case 'hr':
                editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, { horizontalRuleClasses: "" });
                break;
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateInsertButtons();
            });
        });
    }, [editor, updateInsertButtons]);

    const toggleButton = useMemo(() => {
        if (groupedButtons.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Icon path={mdiPlus} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                title={'More...'}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [groupedButtons, handleClick]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="insert-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableAutoFocusItem
            >
                {groupedButtons.map((type) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                dispatchActionsCommand(type);
                                handleClose();
                            }}
                            key={type}
                            selected={false}
                            disabled={!state[type]}
                            sx={{ py: .5 }}>
                            {<>{buttonsSetup[type].icon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    }, [anchorEl, handleClose, groupedButtons, dispatchActionsCommand]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {buttons.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={false}
                            disabled={!state[type]}
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => dispatchActionsCommand(type)}
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
        </Fragment>
    );
}
