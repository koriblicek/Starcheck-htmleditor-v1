import { type DOMConversionMap, LexicalNode, type DOMExportOutput, type EditorConfig, type ElementFormatType, type LexicalEditor, type NodeKey, type Spread, DOMConversionOutput } from 'lexical';
import { $applyNodeReplacement } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { Float, Height, Width } from 'src/types';
import { FigureComponent } from './FigureComponent';

export interface FigurePayload {
    src: string;
    altText?: string;
    caption?: string;
    width?: Width;
    height?: Height;
    float?: Float;
    key?: NodeKey;
}

export interface UpdateFigurePayload {
    altText?: string;
    caption?: string;
    width?: Width;
    height?: Height;
    float?: Float;
}

export type SerializedFigureNode = Spread<
    {
        src: string;
        altText: string;
        caption: string;
        width: Width;
        height: Height;
        float: Float;
    },
    SerializedDecoratorBlockNode
>;

function convertFigureElement(domNode: HTMLElement): null | DOMConversionOutput {
    let caption = "";
    let src = "";
    let altText = "";
    let width = "100%";
    let height = "auto";
    //img
    const imgs = domNode.getElementsByTagName("img");
    if (imgs.length > 0) {
        const src_temp = imgs[0].getAttribute("src");
        if (src_temp)
            src = src_temp;
        const altText_temp = imgs[0].getAttribute("alt");
        if (altText_temp)
            altText = altText_temp;
        const width_temp = window.getComputedStyle(imgs[0]).width;
        if (width_temp)
            width = width_temp;
        const height_temp = window.getComputedStyle(imgs[0]).height;
        if (height_temp)
            height = height_temp;
    }
    //figcaption
    const figcaptions = domNode.getElementsByTagName("figcaption");
    if (figcaptions.length > 0) {
        const caption_temp = figcaptions[0].textContent;
        if (caption_temp)
            caption = caption_temp;
    }
    const node = $createFigureNode({ src, altText, caption, width, height });
    return { node };
}


export class FigureNode extends DecoratorBlockNode {
    __src: string;
    __altText: string;
    __caption: string;
    __width: Width;
    __height: Height;
    __float: Float;

    static getType(): string {
        return 'figure';
    }

    static clone(node: FigureNode): FigureNode {
        return new FigureNode(node.__src, node.__altText, node.__caption, node.__width, node.__height, node.__float, node.__format, node.__key);
    }

    static importJSON(serializedNode: SerializedFigureNode): FigureNode {
        const { src, altText, caption, height, width, float } = serializedNode;
        const node = $createFigureNode({ src, altText, caption, height, width, float });
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON(): SerializedFigureNode {
        return {
            ...super.exportJSON(),
            type: 'figure',
            version: 1,
            src: this.getSrc(),
            altText: this.getAltText(),
            caption: this.getCaption(),
            width: this.getWidth(),
            height: this.getHeight(),
            float: this.getFloat()
        };
    }

    constructor(src: string, altText?: string, caption?: string, width?: Width, height?: Height, float?: Float, format?: ElementFormatType, key?: NodeKey) {
        super(format, key);
        this.__src = src;
        this.__altText = altText || "";
        this.__caption = caption || "";
        this.__width = width;
        this.__height = height;
        this.__float = float;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('figure');
        element.setAttribute('class', editor._config.theme.figure);
        if (this.__format) {
            element.setAttribute('style', `text-align: ${this.__format};`);
        }
        element.setAttribute('class', editor._config.theme.figure);
        const img = document.createElement('img');
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = this.getCaption();
        img.setAttribute('src', this.getSrc());
        img.setAttribute('alt', this.getAltText());
        img.setAttribute('style', `max-width:100%; width: ${this.getWidth() || 'auto'}; height: ${this.getHeight() || 'auto'}; float:${this.getFloat() || 'none'};`);
        element.appendChild(img);
        element.appendChild(figCaption);
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            figure: (domNode: HTMLElement) => {
                const imgs = domNode.getElementsByTagName('img');
                if (imgs.length === 0) {
                    return null;
                }
                return {
                    conversion: convertFigureElement,
                    priority: 1,
                };
            },
        };
    }

    updateDOM(): false {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    getAltText(): string {
        return this.__altText;
    }

    setAltText(altText: string): void {
        const writable = this.getWritable();
        writable.__altText = altText;
    }

    getWidth(): Width {
        return this.__width;
    }

    setWidth(width: Width): void {
        const writable = this.getWritable();
        writable.__width = width;
    }

    getHeight(): Height {
        return this.__height;
    }

    setHeight(height: Height): void {
        const writable = this.getWritable();
        writable.__height = height;
    }

    getFloat(): Float {
        return this.__float;
    }

    setFloat(float: Float): void {
        const writable = this.getWritable();
        writable.__float = float;
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
        const { altText, caption, width, height, float } = payload;
        if (altText !== undefined) {
            writable.__altText = altText;
        }
        if (caption !== undefined) {
            writable.__caption = caption;
        }
        if (width !== undefined) {
            writable.__width = width;
        }
        if (height !== undefined) {
            writable.__height = height;
        }
        if (float !== undefined) {
            writable.__float = float;
        }
    }

    // getTextContent(/*_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined*/): string {
    //     return `https://www.youtube.com/watch?v=${this.__id}`;
    // }

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
                altText={this.getAltText()}
                caption={this.getCaption()}
                width={this.getWidth()}
                height={this.getHeight()}
                float={this.getFloat()}
            />
        );
    }
}

export function $createFigureNode({ src, altText, caption, width, height, float }: FigurePayload): FigureNode {
    return $applyNodeReplacement(new FigureNode(src, altText, caption, width, height, float));
}

export function $isFigureNode(node: FigureNode | LexicalNode | null | undefined): node is FigureNode {
    return node instanceof FigureNode;
}