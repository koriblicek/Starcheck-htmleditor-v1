import { type ElementFormatType, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { Suspense } from 'react';

type EmbedVideoComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        format: ElementFormatType | null;
        nodeKey: NodeKey;
        videoUrl: string;
        posterUrl: string;
    }>;


const imageCache = new Set();

function useSuspenseImage(src: string) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
        });
    }
}

function LazyImage({ posterUrl }: { posterUrl: string; }): JSX.Element {

    useSuspenseImage(posterUrl);

    return (
        <img
            src={posterUrl}
            alt=""
            style={{
                height: 'auto',
                width: '100%',
            }}
        />
    );
}

export function EmbedVideoComponent({ className, format, nodeKey, videoUrl, posterUrl }: EmbedVideoComponentProps) {
    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}
        >
            <Suspense fallback={null}>
                <a href={videoUrl} data-poster={posterUrl} style={{ pointerEvents: 'none' }}>
                    <LazyImage posterUrl={posterUrl} />
                </a>
            </Suspense>
        </BlockWithAlignableContents>
    );
}