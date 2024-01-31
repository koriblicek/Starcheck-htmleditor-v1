/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { CSSProperties, Suspense } from 'react';
import InlineImageComponent from './InlineImageComponent';

// const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'));

export type Float = CSSProperties["float"] | undefined;

export interface InlineImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
  float?: Float;
}

export interface UpdateInlineImagePayload {
  altText?: string;
  float?: Float;
}

function convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createInlineImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedInlineImageNode = Spread<
  {
    altText: string;
    height?: number;
    src: string;
    width?: number;
    float?: Float;
  },
  SerializedLexicalNode
>;

export class InlineImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
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
    );
  }

  static importJSON(
    serializedNode: SerializedInlineImageNode,
  ): InlineImageNode {
    const { altText, height, width, src, float } =
      serializedNode;
    const node = $createInlineImageNode({
      altText,
      height,
      width,
      src,
      float,
    });
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

  constructor(
    src: string,
    altText: string,
    float: Float,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__float = float;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      src: this.getSrc(),
      type: 'inline-image',
      version: 1,
      float: this.__float,
      width: this.__width === 'inherit' ? 0 : this.__width,
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

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  getFloat(): Float {
    return this.__float;
  }

  setFloat(float: Float): void {
    const writable = this.getWritable();
    writable.__float = float;
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable();
    const { altText } = payload;
    if (altText !== undefined) {
      writable.__altText = altText;
    }
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const className = `${config.theme.inlineImage}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(
    prevNode: InlineImageNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): false {
    dom.className = config.theme.inlineImage;
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <InlineImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          float={this.__float}
        />
      </Suspense>
    );
  }
}

export function $createInlineImageNode({
  altText,
  height,
  src,
  width,
  key,
  float
}: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(
    new InlineImageNode(
      src,
      altText,
      float,
      width,
      height,
      key
    ),
  );
}

export function $isInlineImageNode(
  node: LexicalNode | null | undefined,
): node is InlineImageNode {
  return node instanceof InlineImageNode;
}