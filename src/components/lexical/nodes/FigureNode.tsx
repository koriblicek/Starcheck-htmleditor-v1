import { type DOMConversionMap, LexicalNode, type DOMExportOutput, type EditorConfig, type ElementFormatType, type LexicalEditor, type NodeKey, type Spread, DOMConversionOutput } from 'lexical';
import { $applyNodeReplacement } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { FigureComponent } from './FigureComponent';

export interface FigurePayload {
    src: string;
    figureClasses?: string;
    caption?: string;
    key?: NodeKey;
}

export interface UpdateFigurePayload {
    figureClasses?: string;
    caption?: string;
}

export type SerializedFigureNode = Spread<
    {
        src: string;
        figureClasses: string;
        caption: string;
    },
    SerializedDecoratorBlockNode
>;

function convertFigureElement(domNode: HTMLElement): null | DOMConversionOutput {
    let src = "";
    let caption = "";
    let figureClasses = "";
    const figureClasses_tmp = domNode.getAttribute("class");
    if (figureClasses_tmp)
        figureClasses = figureClasses_tmp;
    //img
    const imgs = domNode.getElementsByTagName("img");
    if (imgs.length > 0) {
        const src_temp = imgs[0].getAttribute("src");
        if (src_temp)
            src = src_temp;

    }
    //figcaption
    const figcaptions = domNode.getElementsByTagName("figcaption");
    if (figcaptions.length > 0) {
        const caption_temp = figcaptions[0].textContent;
        if (caption_temp)
            caption = caption_temp;
    }
    const node = $createFigureNode({ src, figureClasses, caption });
    return { node };
}


function convertImageElement(domNode: HTMLElement): null | DOMConversionOutput {
    let src = "";
    let caption = "";
    //img
    if (domNode) {
        const src_temp = domNode.getAttribute("src");
        if (src_temp)
            src = src_temp;
        const altText_temp = domNode.getAttribute("alt");
        if (altText_temp)
            caption = altText_temp;
    }
    const node = $createFigureNode({ src, caption});
    return { node };
}

export class FigureNode extends DecoratorBlockNode {
    __src: string;
    __caption: string;
    __figureClasses: string;

    static getType(): string {
        return 'figure';
    }

    static clone(node: FigureNode): FigureNode {
        return new FigureNode(node.__src, node.__figureClasses, node.__caption, node.__format, node.__key);
    }

    static importJSON(serializedNode: SerializedFigureNode): FigureNode {
        const { src, figureClasses, caption } = serializedNode;
        const node = $createFigureNode({ src, figureClasses, caption });
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON(): SerializedFigureNode {
        return {
            ...super.exportJSON(),
            type: 'figure',
            version: 1,
            src: this.getSrc(),
            figureClasses: this.getFigureClasses(),
            caption: this.getCaption(),
        };
    }

    constructor(src: string, figureClasses?: string, caption?: string, format?: ElementFormatType, key?: NodeKey) {
        super(format, key);
        this.__src = src;
        this.__figureClasses = figureClasses || "";
        this.__caption = caption || "";
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('figure');
        element.setAttribute('style', `${this.__format ? "text-align:" + this.__format + ";" : ""}`);
        element.setAttribute('class', this.getFigureClasses());
        const img = document.createElement('img');
        img.setAttribute('src', this.getSrc());
        img.setAttribute('width', '100%');
        img.setAttribute('alt', this.getCaption());
        img.setAttribute('class', `responsive`);
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = this.getCaption();
        element.appendChild(img);
        element.appendChild(figCaption);
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            figure: (domNode: HTMLElement) => {
                const img = domNode.getElementsByTagName('img');
                if (!img) {
                    return null;
                }
                return {
                    conversion: convertFigureElement,
                    priority: 1,
                };
            },
            img: () => {
                return {
                    conversion: convertImageElement,
                    priority: 1,
                };
            }
        };
    }

    updateDOM(): false {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    getFigureClasses(): string {
        return this.__figureClasses;
    }

    setFigureClasses(figureClasses: string): void {
        const writable = this.getWritable();
        writable.__figureClasses = figureClasses;
    }

    getCaption(): string {
        return this.__caption;
    }

    setCaption(caption: string): void {
        const writable = this.getWritable();
        writable.__caption = caption;
    }

    update(payload: UpdateFigurePayload): void {
        const writable = this.getWritable();
        const { figureClasses, caption } = payload;
        if (figureClasses !== undefined) {
            writable.__figureClasses = figureClasses;
        }
        if (caption !== undefined) {
            writable.__caption = caption;
        }
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        const innerClassName = config.theme.figure;
        return (
            <FigureComponent
                className={className}
                innerClassName={innerClassName}
                format={this.__format}
                nodeKey={this.getKey()}
                src={this.getSrc()}
                figureClasses={this.getFigureClasses()}
                caption={this.getCaption()}
            />
        );
    }
}

export function $createFigureNode({ src, figureClasses, caption }: FigurePayload): FigureNode {
    return $applyNodeReplacement(new FigureNode(src, figureClasses, caption));
}

export function $isFigureNode(node: FigureNode | LexicalNode | null | undefined): node is FigureNode {
    return node instanceof FigureNode;
}