import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { IAppInputData, SaveRestApiPayload } from 'src/types';
import { $generateHtmlFromNodes } from '@lexical/html';

export interface IAutoLoadPluginProps {
    inputData: IAppInputData;
}

export function AutoSavePlugin({ inputData }: IAutoLoadPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [element] = useState<HTMLInputElement | null>(document.getElementById(inputData.dataFormItemId) as HTMLInputElement);

    useEffect(() => {
        if (element) {
            return editor.registerUpdateListener(({ editorState }) => {
                let html = "";
                let data = "";
                editorState.read(() => {
                    data = JSON.stringify(editor.getEditorState());
                    html = $generateHtmlFromNodes(editor);
                });
                element.value = JSON.stringify({ data, html, timestamp: Date.now() } as SaveRestApiPayload);
            });
        }
        // if (element) {
        //     return editor.registerCommand(
        //         AUTO_SAVE_STATE_COMMAND,
        //         () => {
        //             console.log("save");
        //             const editorState = editor.getEditorState();
        //             editorState.read(() => {
        //                 localStorage.setItem(LOCAL_STORAGE_DATA_PREFIX + "-" + inputData.dataFormItemId, JSON.stringify(editor.getEditorState()));
        //             });
        //             return false;
        //         },
        //         COMMAND_PRIORITY_LOW
        //     );
        // }
    }, [editor, element]);

    return (
        null
    );
}


/*
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { IAppInputData, SaveRestApiPayload } from 'src/types';
import { LoadingErrorDialog } from './dialogs/LoadErrorDialog';
import { Backdrop, CircularProgress } from '@mui/material';
// import { COMMAND_PRIORITY_LOW, LexicalCommand, createCommand } from 'lexical';
import useGetAxiosFunction from 'src/hooks/useGetAxiosFunction';

export interface IAutoLoadPluginProps {
    inputData: IAppInputData;
}

export function AutoLoadPlugin({ inputData }: IAutoLoadPluginProps) {
const [editor] = useLexicalComposerContext();

const { response, isLoading, error, axiosFetch, cancelFetch } = useGetAxiosFunction<SaveRestApiPayload>();

useEffect(() => {
    if (inputData.dataLoadOnStart) {
         axiosFetch(inputData.dataRestApiLink + inputData.dataDbKey);
    }
}, [axiosFetch, inputData]);

useEffect(() => {
    if (response?.data) {
        // editor.dispatchCommand(AUTO_LOAD_STATE_COMMAND, response.data);
        editor.update(() => {
            const editorState = editor.parseEditorState(response.data);
            queueMicrotask(() => {
                editor.setEditorState(editorState);
            });
        }, { discrete: true });
    }
}, [editor, response, error]);

function handleClose() {
    cancelFetch();
}

return (
    <div>
        <LoadingErrorDialog error={error} onClose={handleClose} />
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress />
        </Backdrop>
    </div>
);
}
*/
