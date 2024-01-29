import './styles.css';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MuiContentEditable } from './styles';
import { PlaceholderWrapper } from './wrappers/PlaceholderWrapper';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import RichTextWrapper from './wrappers/RichTextWrapper';
import TopToolbarPlugin from './plugins/TopToolbarPlugin';
import EditorWrapper from './wrappers/EditorWrapper';
import BottomToolbarPlugin from './plugins/BottomToolbarPlugin';

const theme = {
    paragraph: "htmleditor-theme-paragraph",
    heading: {
        h1: "htmleditor-theme-heading-h1",
        h2: "htmleditor-theme-heading-h2",
        h3: "htmleditor-theme-heading-h3",
        h4: "htmleditor-theme-heading-h4",
        h5: "htmleditor-theme-heading-h5",
        h6: "htmleditor-theme-heading-h6"
    },
    list: {
        checklist: 'htmleditor-theme-checklist',
        listitemChecked: 'htmleditor-theme-listItemChecked',
        listitemUnchecked: 'htmleditor-theme-listItemUnchecked',
        listitem: 'htmleditor-theme-listItem',
        nested: {
            listitem: 'htmleditor-theme-nestedListItem',
        },
        ul: 'htmleditor-theme-ul',
        olDepth: [
            'htmleditor-theme-ol1',
            'htmleditor-theme-ol2',
            'htmleditor-theme-ol3'
        ]
    },
    quote: "htmleditor-theme-quote",
    text: {
        bold: "htmleditor-theme-text-bold",
        italic: "htmleditor-theme-text-italic",
        underline: "htmleditor-theme-text-underline",
        strikethrough: "htmleditor-theme-text-strikethrough",
        underlineStrikethrough: "htmleditor-theme-text-underline-strikethrough",
        subscript: "htmleditor-theme-text-subscript",
        superscript: "htmleditor-theme-text-superscript",
        code: "htmleditor-theme-text-code",
        highlight: "htmleditor-theme-text-highlight"
    },
    link: "htmleditor-theme-link",
    indent: "htmleditor-theme-style-indent"
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
            HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <EditorWrapper>
                <TopToolbarPlugin />
                <RichTextWrapper>
                    <RichTextPlugin
                        contentEditable={<MuiContentEditable />}
                        placeholder={<PlaceholderWrapper text="Click here to enter text..." />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <BottomToolbarPlugin />
                </RichTextWrapper>
            </EditorWrapper>
            <LinkPlugin />
            <TabIndentationPlugin />
            <ListPlugin />
            <CheckListPlugin />
        </LexicalComposer>
    );
}
