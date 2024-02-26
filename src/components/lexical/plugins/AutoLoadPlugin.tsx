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

// export const AUTO_LOAD_STATE_COMMAND: LexicalCommand<string> = createCommand('AUTO_LOAD_STATE_COMMAND');

export function AutoLoadPlugin({ inputData }: IAutoLoadPluginProps) {
    const { response, isLoading, error, axiosFetch, cancelFetch } = useGetAxiosFunction<SaveRestApiPayload>();

    const [editor] = useLexicalComposerContext();

    // useEffect(() => {
    //     return editor.registerCommand(
    //         AUTO_LOAD_STATE_COMMAND,
    //         (payload) => {
    //             editor.update(() => {
    //                 const editorState = editor.parseEditorState(payload);
    //                 editor.setEditorState(editorState);
    //             }, { discrete: true });
    //             return false;
    //         },
    //         COMMAND_PRIORITY_LOW
    //     );
    // }, [editor]);

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
