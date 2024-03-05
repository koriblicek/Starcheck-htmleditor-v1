import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createHorizontalRuleNode, HorizontalRuleNode, HorizontalRulePayload } from '../nodes/HorizontalRuleNode';

export type InsertHorizontalRulePayload = Readonly<HorizontalRulePayload>;

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<HorizontalRulePayload> = createCommand('INSERT_HORIZONTAL_RULE_COMMAND');

export default function HorizontalRulePlugin(): JSX.Element | null {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([HorizontalRuleNode])) {
            throw new Error('HorizontalRulePlugin: HorizontalRuleNode not registered on editor');
        }
        return editor.registerCommand<InsertHorizontalRulePayload>(
            INSERT_HORIZONTAL_RULE_COMMAND,
            (payload) => {
                const selection = $getSelection();

                if (!$isRangeSelection(selection)) {
                    return false;
                }

                const horizontalRuleNode = $createHorizontalRuleNode(payload);
                $insertNodeToNearestRoot(horizontalRuleNode);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);
    return null;
}