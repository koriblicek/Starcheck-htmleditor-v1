import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { IAppInputData, SaveRestApiPayload } from 'src/types';
import { LoadingErrorDialog } from './dialogs/LoadErrorDialog';
import useGetAxiosFunction from 'src/hooks/useGetAxiosFunction';
import { Backdrop, CircularProgress } from '@mui/material';

export interface IAutoLoadPluginProps {
    inputData: IAppInputData;
}

export function AutoLoadPlugin({ inputData }: IAutoLoadPluginProps) {
    const { response, isLoading, error, axiosFetch, cancelFetch } = useGetAxiosFunction<SaveRestApiPayload>();

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (inputData.dataLoadOnStart) {
            axiosFetch(inputData.dataRestApiLink + inputData.dataDbKey);
        }
    }, [axiosFetch, inputData]);

    useEffect(() => {
        if (response) {
            editor.update(() => {
                const editorState = editor.parseEditorState(response.data);
                editor.setEditorState(editorState);
            });
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
