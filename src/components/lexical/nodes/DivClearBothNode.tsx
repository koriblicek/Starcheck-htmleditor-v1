import { type DOMConversionMap, LexicalNode, type DOMExportOutput, type EditorConfig, type LexicalEditor, type NodeKey, type Spread } from 'lexical';
import { $applyNodeReplacement } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { DivClearBothComponent } from './DivClearBothComponent';

export interface DivClearBothPayload {
    divClearBothClasses?: string;
    key?: NodeKey;
}

export interface UpdateDivClearBothPayload {
    divClearBothClasses?: string;
}

export type SerializedDivClearBothNode = Spread<
    {
        divClearBothClasses: string;
    },
    SerializedDecoratorBlockNode
>;

export class DivClearBothNode extends DecoratorBlockNode {
    __divClearBothClasses: string;

    static getType(): string {
        return 'div-clear-both';
    }

    static clone(node: DivClearBothNode): DivClearBothNode {
        return new DivClearBothNode(node.__divClearBothClasses, node.__key);
    }

    static importJSON(serializedNode: SerializedDivClearBothNode): DivClearBothNode {
        const { divClearBothClasses } = serializedNode;
        const node = $createDivClearBothNode({ divClearBothClasses });
        return node;
    }

    exportJSON(): SerializedDivClearBothNode {
        return {
            ...super.exportJSON(),
            type: 'div-clear-both',
            version: 1,
            divClearBothClasses: this.getDivClearBothClasses(),
        };
    }

    constructor(figureClasses?: string, key?: NodeKey) {
        super(undefined, key);
        this.__divClearBothClasses = figureClasses || "";
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('div');
        element.setAttribute('class', this.getDivClearBothClasses());
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return null;
    }

    updateDOM(): false {
        return false;
    }

    getDivClearBothClasses(): string {
        return this.__divClearBothClasses;
    }

    setDivClearBothClasses(divClearBothClasses: string): void {
        const writable = this.getWritable();
        writable.__divClearBothClasses = divClearBothClasses;
    }

    update(payload: UpdateDivClearBothPayload): void {
        const writable = this.getWritable();
        const { divClearBothClasses } = payload;
        if (divClearBothClasses !== undefined) {
            writable.__divClearBothClasses = divClearBothClasses;
        }
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <DivClearBothComponent
                className={className}
                nodeKey={this.getKey()}
                divClearBothClasses={this.getDivClearBothClasses()}
            />
        );
    }
}

export function $createDivClearBothNode({ divClearBothClasses }: DivClearBothPayload): DivClearBothNode {
    return $applyNodeReplacement(new DivClearBothNode(divClearBothClasses));
}

export function $isDivClearBothNode(node: DivClearBothNode | LexicalNode | null | undefined): node is DivClearBothNode {
    return node instanceof DivClearBothNode;
}