import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';

export default function MyOnChangePlugin(props: { onChange: (editorState: EditorState) => void; }) {
    const { onChange } = props;
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [onChange, editor]);

    return null;
}