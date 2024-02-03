import type { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread, } from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { CSSProperties, Suspense } from 'react';
import InlineImageComponent from './InlineImageComponent';

// const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'));
export type Float = CSSProperties["float"] | undefined;
export type Width = CSSProperties["width"];
export type Height = CSSProperties["height"];

export interface InlineImagePayload {
  src: string;
  altText?: string;
  key?: NodeKey;
  width?: Width;
  height?: Height;
  float?: Float;
}

export interface UpdateInlineImagePayload {
  altText?: string;
  caption?: string;
  width?: Width;
  height?: Height;
  float?: Float;
}

export type SerializedInlineImageNode = Spread<{ altText: string; height?: Height; src: string; width?: Width; float?: Float; caption?: string; }, SerializedLexicalNode>;

function convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createInlineImageNode({ altText, src, width, height });
    return { node };
  }
  return null;
}


export class InlineImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __caption: string;
  __width: Width;
  __height: Height;
  __float: Float;

  static getType(): string {
    return 'inline-image';
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__altText,
      node.__float,
      node.__width,
      node.__height,
      node.__key,
      node.__caption
    );
  }

  static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode {
    const { altText, height, width, src, float } = serializedNode;
    const node = $createInlineImageNode({ altText, height, width, src, float });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (/*node: Node*/) => ({
        conversion: convertInlineImageElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, altText?: string, float?: Float, width?: Width, height?: Height, key?: NodeKey, caption?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText || "";
    this.__caption = caption || "";
    this.__width = width;
    this.__height = height;
    this.__float = float;
  }

  exportDOM(): DOMExportOutput {
    console.log("exportDOM");

    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('style', `max-width:100%; width: ${this.getWidth() || 'auto'}; height: ${this.getHeight() || 'auto'}; float:${this.getFloat() || 'none'};`);
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      type: 'inline-image',
      src: this.getSrc(),
      altText: this.getAltText(),
      caption: this.getCaption(),
      width: this.getWidth(),
      height: this.getHeight(),
      float: this.getFloat(),
      version: 1,
    };
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

  update(payload: UpdateInlineImagePayload): void {
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

  // View

  createDOM(config: EditorConfig): HTMLElement {
    console.log("createDOM");
    const span = document.createElement('span');
    const className = `${config.theme.inlineImage}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(prevNode: InlineImageNode, dom: HTMLElement, config: EditorConfig): false {
    console.log(prevNode);
    dom.className = config.theme.inlineImage;
    return false;
  }

  decorate(): JSX.Element {
    console.log("decorate");
    return (
      <Suspense fallback={null}>
        <InlineImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          float={this.__float}
          caption={this.__caption}
        />
      </Suspense>
    );
  }
}

export function $createInlineImageNode({ altText, height, src, width, key, float }: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(new InlineImageNode(src, altText, float, width, height, key));
}

export function $isInlineImageNode(node: LexicalNode | null | undefined): node is InlineImageNode {
  return node instanceof InlineImageNode;
}