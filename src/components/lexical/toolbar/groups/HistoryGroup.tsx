import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { LexicalEditor, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND, COMMAND_PRIORITY_LOW, CLEAR_HISTORY_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { HistoryType, ICON_SIZE } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiUndo } from '@mdi/js';
import { mdiRedo } from '@mdi/js';
import { mdiCloseCircleOutline } from '@mdi/js';
import { mdiDotsVertical } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

interface IHistoryGroupProps {
    editor: LexicalEditor;
    buttons?: HistoryType[];
    groupedButtons?: HistoryType[];
}

type RecordHistoryType = Record<HistoryType, boolean>;

type Setup = Record<HistoryType, { icon: JSX.Element, title: string; }>;


const buttonsSetup = {
    redo: { icon: <Icon path={mdiRedo} size={ICON_SIZE} />, title: "Redo (Ctrl+Y)" },
    undo: { icon: <Icon path={mdiUndo} size={ICON_SIZE} />, title: "Undo (Ctrl+Z)" },
    clear_history: { icon: <Icon path={mdiCloseCircleOutline} size={ICON_SIZE} />, title: "Clear history" }
} as Setup;

const initialState: RecordHistoryType = { redo: false, undo: false, clear_history: false };

export default function HistoryGroup({ editor, buttons = ['undo', 'redo', 'clear_history'], groupedButtons = [] }: IHistoryGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [state, setState] = useState<RecordHistoryType>(initialState);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const dispatchActionsCommand = useCallback((type: HistoryType) => {
        switch (type) {
            case 'redo':
                editor.dispatchCommand(REDO_COMMAND, undefined);
                break;
            case 'undo':
                editor.dispatchCommand(UNDO_COMMAND, undefined);
                break;
            case 'clear_history':
                editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
                setState(prevState => { return { ...prevState, clear_history: false }; });
                break;
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setState(prevState => { return { ...prevState, undo: payload, clear_history: (payload || prevState.clear_history) }; });
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setState(prevState => { return { ...prevState, redo: payload, clear_history: (payload || prevState.clear_history) }; });
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    const toggleButton = useMemo(() => {
        if (groupedButtons.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Icon path={mdiDotsVertical} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                title={'More...'}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [groupedButtons, handleClick]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="history-menu"
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
    }, [state, anchorEl, handleClose, groupedButtons, dispatchActionsCommand]);

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
