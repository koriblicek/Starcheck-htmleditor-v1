import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createFigureNode, FigureNode, FigurePayload } from '../nodes/FigureNode';

export type InsertFigurePayload = Readonly<FigurePayload>;

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_FIGURE_COMMAND: LexicalCommand<FigurePayload> = createCommand('INSERT_FIGURE_COMMAND');

export default function FigurePlugin(): JSX.Element | null {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([FigureNode])) {
            throw new Error('FigurePlugin: FigureNode not registered on editor');
        }
        return editor.registerCommand<InsertFigurePayload>(
            INSERT_FIGURE_COMMAND,
            (payload) => {
                const figureNode = $createFigureNode(payload);
                $insertNodeToNearestRoot(figureNode);

                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);
    return null;
}