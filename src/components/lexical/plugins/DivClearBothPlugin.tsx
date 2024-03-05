import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createDivClearBothNode, DivClearBothNode, DivClearBothPayload } from '../nodes/DivClearBothNode';

export type InsertDivClearBothPayload = Readonly<DivClearBothPayload>;

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_DIV_CLEAR_BOTH_COMMAND: LexicalCommand<DivClearBothPayload> = createCommand('INSERT_DIV_CLEAR_BOTH_COMMAND');

export default function DivClearBothPlugin(): JSX.Element | null {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([DivClearBothNode])) {
            throw new Error('DivClearBothPlugin: DivClearBothNode not registered on editor');
        }
        return editor.registerCommand<InsertDivClearBothPayload>(
            INSERT_DIV_CLEAR_BOTH_COMMAND,
            (payload) => {
                const divClearBothNode = $createDivClearBothNode(payload);
                $insertNodeToNearestRoot(divClearBothNode);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);
    return null;
}