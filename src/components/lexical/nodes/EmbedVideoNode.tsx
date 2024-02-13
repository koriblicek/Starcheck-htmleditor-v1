import { type DOMConversionMap, type DOMConversionOutput, type DOMExportOutput, type EditorConfig, type ElementFormatType, type LexicalEditor, type LexicalNode, type NodeKey, type Spread } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';

import './YouTubeNode.css';
import { EmbedVideoComponent } from './EmbedVideoComponent';

export type SerializedEmbedVideoNode = Spread<{ videoUrl: string; posterUrl: string; }, SerializedDecoratorBlockNode>;

export interface EmbedVideoPayload {
    videoUrl: string;
    posterUrl: string;
    key?: NodeKey;
}

function convertEmbedVideoElement(domNode: HTMLElement): null | DOMConversionOutput {
    const videoUrl = domNode.getAttribute('data-lexical-video-url');
    const posterUrl = domNode.getAttribute('data-lexical-poster-url');
    if ((videoUrl) && (posterUrl)) {
        const node = $createEmbedVideoNode({ videoUrl, posterUrl });
        return { node };
    }
    return null;
}

export class EmbedVideoNode extends DecoratorBlockNode {
    __videoUrl: string;
    __posterUrl: string;

    static getType(): string {
        return 'embed-video';
    }

    static clone(node: EmbedVideoNode): EmbedVideoNode {
        return new EmbedVideoNode(node.__videoUrl, node.__posterUrl, node.__format, node.__key);
    }

    static importJSON(serializedNode: SerializedEmbedVideoNode): EmbedVideoNode {
        const { videoUrl, posterUrl } = serializedNode;
        const node = $createEmbedVideoNode({ videoUrl, posterUrl });
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON(): SerializedEmbedVideoNode {
        return {
            ...super.exportJSON(),
            type: 'embed-video',
            version: 1,
            videoUrl: this.__videoUrl,
            posterUrl: this.__posterUrl,
        };
    }

    constructor(videoUrl: string, posterUrl: string, format?: ElementFormatType, key?: NodeKey) {
        super(format, key);
        this.__videoUrl = videoUrl;
        this.__posterUrl = posterUrl;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('div');
        element.setAttribute('data-lexical-video-url', this.__videoUrl);
        element.setAttribute('data-lexical-poster-url', this.__posterUrl);
        element.setAttribute('class', editor._config.theme.embedVideo);
        const a = document.createElement('a');
        a.setAttribute('href', this.__videoUrl);
        a.setAttribute('data-poster', this.__posterUrl);
        const img = document.createElement('img');
        img.setAttribute("src", this.__posterUrl);
        img.setAttribute("style", "width: 100%;");
        a.appendChild(img);
        element.appendChild(a);
        /*
                const element = document.createElement('iframe');
                element.setAttribute('data-lexical-youtube', this.__id);
                element.setAttribute('style', 'width:100%; aspect-ratio: 16/9');
                element.setAttribute('src', `https://www.youtube-nocookie.com/embed/${this.__id}`);
                element.setAttribute('frameborder', '0');
                element.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                element.setAttribute('allowfullscreen', 'true');
                element.setAttribute('title', 'YouTube video');
                return { element };
                */
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            a: (domNode: HTMLElement) => {
                if (!(domNode.hasAttribute('data-lexical-video-url') && domNode.hasAttribute('data-lexical-video-url'))) {
                    return null;
                }
                return {
                    conversion: convertEmbedVideoElement,
                    priority: 1,
                };
            }
        };
        return null;
    }

    updateDOM(): false {
        return false;
    }

    getVideoUrl(): string {
        return this.__videoUrl;
    }

    getPosterUrl(): string {
        return this.__posterUrl;
    }


    getTextContent(/*_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined*/): string {
        return `${this.getPosterUrl()}`;
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <EmbedVideoComponent
                className={className}
                format={this.__format}
                nodeKey={this.getKey()}
                videoUrl={this.getVideoUrl()}
                posterUrl={this.getPosterUrl()}
            />
        );
    }
}

export function $createEmbedVideoNode({ videoUrl, posterUrl }: EmbedVideoPayload): EmbedVideoNode {
    return new EmbedVideoNode(videoUrl, posterUrl);
}

export function $isEmbedVideoNode(node: EmbedVideoNode | LexicalNode | null | undefined): node is EmbedVideoNode {
    return node instanceof EmbedVideoNode;
}