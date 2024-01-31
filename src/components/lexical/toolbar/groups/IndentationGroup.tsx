import { Fragment, useCallback } from "react";
import { Grid } from "@mui/material";
import { LexicalEditor, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";
import { ICON_SIZE, IndentationType } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatIndentDecrease } from '@mdi/js';
import { mdiFormatIndentIncrease } from '@mdi/js';

interface IIndentationGroupProps {
    editor: LexicalEditor;
    include?: IndentationType[];
}

type Setup = Record<IndentationType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    outdent: { icon: <Icon path={mdiFormatIndentDecrease} size={ICON_SIZE} />, title: "Decrease Indentation" },
    indent: { icon: <Icon path={mdiFormatIndentIncrease} size={ICON_SIZE} />, title: "Increase Indentation" }
} as Setup;

export default function IndentationGroup({ editor, include = ['outdent', 'indent'] }: IIndentationGroupProps) {

    const dispatchActionsCommand = useCallback((type: IndentationType) => {
        switch (type) {
            case 'outdent':
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                break;
            case 'indent':
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                break;
        }
    }, [editor]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {include.map((type) => (
                    <Grid item key={type}>
                        <ToolbarToggleButton
                            selected={false}
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
