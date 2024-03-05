import { type DOMConversionMap, LexicalNode, type DOMExportOutput, type EditorConfig, type LexicalEditor, type NodeKey, type Spread, DOMConversionOutput } from 'lexical';
import { $applyNodeReplacement } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { HorizontalRuleComponent } from './HorizontalRuleComponent';

export interface HorizontalRulePayload {
    horizontalRuleClasses?: string;
    key?: NodeKey;
}

export interface UpdateHorizontalRulePayload {
    horizontalRuleClasses?: string;
}

export type SerializedHorizontalRuleNode = Spread<
    {
        horizontalRuleClasses: string;
    },
    SerializedDecoratorBlockNode
>;


function convertHorizontalRuleElement(domNode: HTMLElement): null | DOMConversionOutput {
    let horizontalRuleClasses = "";
    if (domNode) {
        const class_temp = domNode.getAttribute("class");
        if (class_temp)
            horizontalRuleClasses = class_temp;
    }
    const node = $createHorizontalRuleNode({ horizontalRuleClasses });
    return { node };
}

export class HorizontalRuleNode extends DecoratorBlockNode {
    __horizontalRuleClasses: string;

    static getType(): string {
        return 'horizontal-rule';
    }

    static clone(node: HorizontalRuleNode): HorizontalRuleNode {
        return new HorizontalRuleNode(node.__horizontalRuleClasses, node.__key);
    }

    static importJSON(serializedNode: SerializedHorizontalRuleNode): HorizontalRuleNode {
        const { horizontalRuleClasses } = serializedNode;
        const node = $createHorizontalRuleNode({ horizontalRuleClasses });
        return node;
    }

    exportJSON(): SerializedHorizontalRuleNode {
        return {
            ...super.exportJSON(),
            type: 'horizontal-rule',
            version: 1,
            horizontalRuleClasses: this.getHorizontalRuleClasses(),
        };
    }

    constructor(figureClasses?: string, key?: NodeKey) {
        super(undefined, key);
        this.__horizontalRuleClasses = figureClasses || "";
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('hr');
        element.setAttribute('class', this.getHorizontalRuleClasses());
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            hr: (_: HTMLElement) => {
                return {
                    conversion: convertHorizontalRuleElement,
                    priority: 1,
                };
            }
        };
    }

    updateDOM(): false {
        return false;
    }

    getHorizontalRuleClasses(): string {
        return this.__horizontalRuleClasses;
    }

    setHorizontalRuleClasses(horizontalRuleClasses: string): void {
        const writable = this.getWritable();
        writable.__horizontalRuleClasses = horizontalRuleClasses;
    }

    update(payload: UpdateHorizontalRulePayload): void {
        const writable = this.getWritable();
        const { horizontalRuleClasses } = payload;
        if (horizontalRuleClasses !== undefined) {
            writable.__horizontalRuleClasses = horizontalRuleClasses;
        }
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <HorizontalRuleComponent
                className={className}
                nodeKey={this.getKey()}
                horizontalRuleClasses={this.getHorizontalRuleClasses()}
            />
        );
    }
}

export function $createHorizontalRuleNode({ horizontalRuleClasses }: HorizontalRulePayload): HorizontalRuleNode {
    return $applyNodeReplacement(new HorizontalRuleNode(horizontalRuleClasses));
}

export function $isHorizontalRuleNode(node: HorizontalRuleNode | LexicalNode | null | undefined): node is HorizontalRuleNode {
    return node instanceof HorizontalRuleNode;
}