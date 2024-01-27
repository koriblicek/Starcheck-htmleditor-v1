import { Fragment, useCallback, useMemo } from "react";
import { Grid } from "@mui/material";
import { LexicalEditor, CLEAR_EDITOR_COMMAND } from "lexical";
import { ActionsType, ICON_SIZE } from "src/types";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';

interface IActionsGroupProps {
    editor: LexicalEditor;
    include?: ActionsType[];
}

type Setup = Record<ActionsType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    clear: { icon: <Icon path={mdiTrashCanOutline} size={ICON_SIZE} />, title: "Clear Editor" }
} as Setup;

export default function ActionsGroup({ editor, include = ['clear'] }: IActionsGroupProps) {

    const clearPlugin = useMemo(() => {
        return <ClearEditorPlugin />;
    }, []);

    const dispatchActionsCommand = useCallback((type: ActionsType) => {
        switch (type) {
            case 'clear':
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                break;
        }
    }, [editor]);

    return (
        <Fragment>
            {clearPlugin}
            <Grid container columnGap={.5} alignItems='center' sx={{ backgroundColor: 'white' }} wrap='nowrap'>
                {include.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={true}
                            value={type}
                            color="error"
                            size="small"
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
