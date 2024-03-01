import { Fragment, useCallback, useMemo, useState } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { LexicalEditor, CLEAR_EDITOR_COMMAND } from "lexical";
import { ActionsType, IAppInputData, ICON_SIZE, LOCAL_STORAGE_DATA_PREFIX, SaveRestApiPayload } from "src/types";
import ToolbarToggleButton from "src/components/ui/ToolbarToggleButton";
import { $generateHtmlFromNodes } from '@lexical/html';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import { ClearEditorDialog } from "./actions/ClearEditorDialog";
import { mdiEyeOutline } from '@mdi/js';
import { PreviewDialog } from "./actions/PreviewDialog";
import { mdiImport } from '@mdi/js';
import { mdiContentSaveOutline } from '@mdi/js';
import { SaveLocalStorageDialog } from "./actions/SaveLocalStorageDialog";
import { mdiDotsVertical } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import { mdiCloudUploadOutline } from '@mdi/js';
import { mdiCloudDownloadOutline } from '@mdi/js';
import { SaveRestApiDialog } from "./actions/SaveRestApiDialog";
import { LoadLocalStorageDialog } from "./actions/LoadLocalStorageDialog";
import { LoadRestApiDialog } from "./actions/LoadRestApiDialog";


interface IActionsGroupProps {
    editor: LexicalEditor;
    buttons?: ActionsType[];
    groupedButtons?: ActionsType[];
    inputData: IAppInputData;
}

type Setup = Record<ActionsType, { icon: JSX.Element, title: string; }>;

const buttonsSetup = {
    clear: { icon: <Icon path={mdiTrashCanOutline} size={ICON_SIZE} />, title: "Clear Editor" },
    preview: { icon: <Icon path={mdiEyeOutline} size={ICON_SIZE} />, title: "Preview" },
    save_local_storage: { icon: <Icon path={mdiContentSaveOutline} size={ICON_SIZE} />, title: "Save To Local Storage" },
    save_rest: { icon: <Icon path={mdiCloudUploadOutline} size={ICON_SIZE} />, title: "Save To REST API" },
    load_local_storage: { icon: <Icon path={mdiImport} size={ICON_SIZE} />, title: "Load From Local Storage" },
    load_rest: { icon: <Icon path={mdiCloudDownloadOutline} size={ICON_SIZE} />, title: "Load From REST API" },
} as Setup;

export default function ActionsGroup({ editor, buttons = [], groupedButtons = [], inputData }: IActionsGroupProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [isClearOpen, setIsClearOpen] = useState<boolean>(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [isLoadLocalStorageOpen, setIsLoadLocalStorageOpen] = useState<boolean>(false);
    const [isSaveLocalStorageOpen, setIsSaveLocalStorageOpen] = useState<boolean>(false);
    const [isSaveRestApiOpen, setIsSaveRestApiOpen] = useState<boolean>(false);
    const [isLoadRestApiOpen, setIsLoadRestApiOpen] = useState<boolean>(false);
    const [restApiData, setRestApiData] = useState<SaveRestApiPayload | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string>("");

    const handleClick = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const dispatchActionsCommand = useCallback((type: ActionsType) => {
        switch (type) {
            case 'clear':
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                break;
        }
    }, [editor]);

    const handleToggleClick = useCallback((type: ActionsType) => {
        if (type === "clear") {
            setIsClearOpen(true);
        }
        if (type === "preview") {
            setIsPreviewOpen(true);
            const editorState = editor.getEditorState();
            let htmlString = '';
            editorState.read(() => {
                htmlString = $generateHtmlFromNodes(editor);
            });
            setPreviewHtml(htmlString);
        }
        if (type === "save_local_storage") {
            setIsSaveLocalStorageOpen(true);
        }
        if (type === "load_local_storage") {
            setIsLoadLocalStorageOpen(true);
        }
        if (type === "save_rest") {
            setIsSaveRestApiOpen(true);
            const editorState = editor.getEditorState();
            let html = "";
            let data = "";
            editorState.read(() => {
                data = JSON.stringify(editor.getEditorState());
                html = $generateHtmlFromNodes(editor);
            });
            setRestApiData({ data, html, timestamp: Date.now() });
        }
        if (type === "load_rest") {
            setIsLoadRestApiOpen(true);
        }
    }, [editor]);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleCloseDialogs = useCallback(() => {
        setIsClearOpen(false);
        setIsPreviewOpen(false);
        setIsSaveLocalStorageOpen(false);
        setIsLoadLocalStorageOpen(false);
        setIsSaveRestApiOpen(false);
        setIsLoadRestApiOpen(false);
        setRestApiData(null);
    }, []);

    const onClearConfirmed = useCallback((confirm: boolean) => {
        if (confirm) {
            dispatchActionsCommand("clear");
        }
        handleCloseDialogs();
    }, [dispatchActionsCommand, handleCloseDialogs]);

    const onSaveLocalStorageAction = useCallback((confirm: boolean) => {
        if (confirm) {
            const editorState = editor.getEditorState();
            editorState.read(() => {
                localStorage.setItem(LOCAL_STORAGE_DATA_PREFIX + "-" + inputData.dataFormItemId, JSON.stringify(editor.getEditorState()));
            });
        }
        handleCloseDialogs();
    }, [editor, handleCloseDialogs, inputData]);

    const onLoadLocalStorageAction = useCallback((confirm: boolean) => {
        if (confirm) {
            const loadedData = localStorage.getItem(LOCAL_STORAGE_DATA_PREFIX + "-" + inputData.dataFormItemId);
            if (loadedData) {
                editor.update(() => {
                    const editorState = editor.parseEditorState(loadedData);
                    queueMicrotask(() => {
                        editor.setEditorState(editorState);
                    });
                });
            }
        }
        handleCloseDialogs();
    }, [editor, handleCloseDialogs, inputData]);

    const onLoadRestApiAction = useCallback((data: SaveRestApiPayload) => {
        if (data.data) {
            editor.update(() => {
                const editorState = editor.parseEditorState(data.data);
                editor.setEditorState(editorState);
            });
        }
        handleCloseDialogs();
    }, [editor, handleCloseDialogs]);

    const clearDialog = useMemo(() => {
        return (
            <ClearEditorDialog open={isClearOpen} onAction={onClearConfirmed} />
        );
    }, [isClearOpen, onClearConfirmed]);

    const previewDialog = useMemo(() => {
        return (
            <PreviewDialog open={isPreviewOpen} onClose={handleCloseDialogs} htmlData={previewHtml} />
        );
    }, [isPreviewOpen, previewHtml, handleCloseDialogs]);

    const loadLocalStorageDialog = useMemo(() => {
        return (
            <LoadLocalStorageDialog open={isLoadLocalStorageOpen} onAction={onLoadLocalStorageAction} />
        );
    }, [isLoadLocalStorageOpen, onLoadLocalStorageAction]);

    const saveLocalStorageDialog = useMemo(() => {
        return (
            <SaveLocalStorageDialog open={isSaveLocalStorageOpen} onAction={onSaveLocalStorageAction} />
        );
    }, [isSaveLocalStorageOpen, onSaveLocalStorageAction]);

    const saveRestApiDialog = useMemo(() => {
        return (
            <SaveRestApiDialog open={isSaveRestApiOpen} onClose={handleCloseDialogs} data={restApiData} inputData={inputData} />
        );
    }, [isSaveRestApiOpen, handleCloseDialogs, restApiData, inputData]);

    const loadRestApiDialog = useMemo(() => {
        return (
            <LoadRestApiDialog open={isLoadRestApiOpen} onAction={onLoadRestApiAction} onClose={handleCloseDialogs} inputData={inputData} />
        );
    }, [isLoadRestApiOpen, onLoadRestApiAction, handleCloseDialogs, inputData]);

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
                onClose={handleCloseMenu}
                disableAutoFocusItem
            >
                {groupedButtons.map((type) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                handleToggleClick(type);
                                handleCloseMenu();
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
    }, [anchorEl, handleCloseMenu, groupedButtons, handleToggleClick]);

    return (
        <Fragment>
            <Grid container columnGap={.5} alignItems='center' wrap='nowrap'>
                {buttons.map((type) => (
                    <Grid item key={type} sx={{ backgroundColor: 'white' }}>
                        <ToolbarToggleButton
                            selected={false}
                            color="standard"
                            value={type}
                            label={buttonsSetup[type].icon}
                            title={buttonsSetup[type].title}
                            onClick={() => handleToggleClick(type)}
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
            {clearDialog}
            {previewDialog}
            {saveLocalStorageDialog}
            {loadLocalStorageDialog}
            {saveRestApiDialog}
            {loadRestApiDialog}
        </Fragment>
    );
}
