import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { type ElementFormatType, type NodeKey } from 'lexical';

type YouTubeComponentProps = Readonly<{ className: Readonly<{ base: string; focus: string; }>; format: ElementFormatType | null; nodeKey: NodeKey; videoID: string; }>;

export default function YouTubeComponent({ className, format, nodeKey, videoID }: YouTubeComponentProps) {
    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}>
            <iframe
                style={{ width: '100%', aspectRatio: '16/9', pointerEvents: 'none' }}
                src={`https://www.youtube-nocookie.com/embed/${videoID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
                title="YouTube video"
            />
        </BlockWithAlignableContents>
    );
}