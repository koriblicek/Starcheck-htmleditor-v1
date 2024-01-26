import './styles.css';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { MuiContentEditable } from './styles';
import { PlaceholderWrapper } from './wrappers/PlaceholderWrapper';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import RichTextWrapper from './wrappers/RichTextWrapper';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import EditorWrapper from './wrappers/EditorWrapper';

const theme = {
    root: 'editor-lexical-composer',
    // Theme styling goes here
    paragraph: 'editor-theme-paragraph',
    heading: {
        h1: "editor-theme-heading-h1",
        h2: "editor-theme-heading-h2",
        h3: "editor-theme-heading-h3",
        h4: "editor-theme-heading-h4",
        h5: "editor-theme-heading-h5",
        h6: "editor-theme-heading-h6"
    },
    quote: "editor-theme-quote",
    text: {
        bold: "editor-theme-text-bold",
        italic: "editor-theme-text-italic",
        underline: "editor-theme-text-underline",
        strikethrough: "editor-theme-text-strikethrough",
        underlineStrikethrough: "editor-theme-text-underline-strikethrough",
        subscript: "editor-theme-text-subscript",
        superscript: "editor-theme-text-superscript",
        code: "editor-theme-text-code",
        highlight: "editor-theme-text-highlight"
    }
};


// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
    console.error(error);
}


export default function Editor(): JSX.Element {
    const initialConfig = {
        namespace: 'Starcheck-html-editor',
        theme: theme,
        onError: onError,
        nodes: [
            HeadingNode, QuoteNode
        ]
    };

    return (
        <EditorWrapper>
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <RichTextWrapper>
                    <RichTextPlugin
                        contentEditable={<MuiContentEditable />}
                        placeholder={<PlaceholderWrapper text="Click here to enter text..." />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </RichTextWrapper>
                <TabIndentationPlugin />
            </LexicalComposer>
        </EditorWrapper>
    );
}
