import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { LexicalEditor, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND, COMMAND_PRIORITY_LOW, CLEAR_HISTORY_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { HistoryType, ICON_SIZE, RecordHistoryType } from "src/types";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiUndo } from '@mdi/js';
import { mdiRedo } from '@mdi/js';
import { mdiCloseCircleOutline } from '@mdi/js';

interface IHistoryGroupProps {
    editor: LexicalEditor;
    include?: HistoryType[];
}

type Setup = Record<HistoryType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    redo: { icon: <Icon path={mdiRedo} size={ICON_SIZE} />, title: "Redo (Ctrl+Y)" },
    undo: { icon: <Icon path={mdiUndo} size={ICON_SIZE} />, title: "Undo (Ctrl+Z)" },
    clear_history: { icon: <Icon path={mdiCloseCircleOutline} size={ICON_SIZE} />, title: "Clear history" }
} as Setup;

const initialState: RecordHistoryType = { redo: false, undo: false, clear_history: false };

export default function HistoryGroup({ editor, include = ['undo', 'redo'] }: IHistoryGroupProps) {

    const [state, setState] = useState<RecordHistoryType>(initialState);

    const historyPlugin = useMemo(() => {
        return <HistoryPlugin />;
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

    return (
        <Fragment>
            {historyPlugin}
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                {include.map((type) => (
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
            </Grid>
        </Fragment>
    );
}
