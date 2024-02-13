import { Fragment, useCallback, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { LexicalEditor, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";
import { ICON_SIZE, ElementIndentationType } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import Icon from '@mdi/react';
import { mdiFormatIndentDecrease } from '@mdi/js';
import { mdiFormatIndentIncrease } from '@mdi/js';
import { mdiDotsVertical } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

interface IElementIndentationGroupProps {
    editor: LexicalEditor;
    buttons?: ElementIndentationType[];
    groupedButtons?: ElementIndentationType[];
}

type Setup = Record<ElementIndentationType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    outdent: { icon: <Icon path={mdiFormatIndentDecrease} size={ICON_SIZE} />, title: "Decrease Indentation" },
    indent: { icon: <Icon path={mdiFormatIndentIncrease} size={ICON_SIZE} />, title: "Increase Indentation" }
} as Setup;

export default function ElementIndentationGroup({ editor, buttons = [], groupedButtons = [] }: IElementIndentationGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const dispatchActionsCommand = useCallback((type: ElementIndentationType) => {
        switch (type) {
            case 'outdent':
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                break;
            case 'indent':
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                break;
        }
    }, [editor]);

    const menu = useMemo(() => {
        return (
            <Menu
                id="element-indentation-menu"
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
                            sx={{ py: .5 }}>
                            {<>{buttonsSetup[type].icon}<Typography variant='subtitle1' sx={{ px: 0.5 }}>{buttonsSetup[type].title}</Typography></>}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    }, [anchorEl, handleClose, dispatchActionsCommand, groupedButtons]);

    const toggleButton = useMemo(() => {
        if (groupedButtons.length === 0) {
            return null;
        }
        return (
            <ToolbarToggleButton
                selected={false}
                value="state"
                label={<><Icon path={mdiDotsVertical} size={ICON_SIZE} /><Icon path={mdiChevronDown} size={ICON_SIZE} /></>}
                title={'Indentation Options'}
                onClick={(e: React.MouseEvent) => handleClick(e)}
            />
        );
    }, [groupedButtons, handleClick]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap' width='auto'>
                {buttons.map((type) => (
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
