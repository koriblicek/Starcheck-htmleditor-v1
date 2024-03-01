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
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { EditorToolbarsSetup, IAppInputData, setupDefault } from 'src/types';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import RichTextWrapper from './wrappers/RichTextWrapper';
import TopToolbar from './toolbar/TopToolbar';
import EditorWrapper from './wrappers/EditorWrapper';
import YouTubePlugin from './plugins/YouTubePlugin';
import { YouTubeNode } from './nodes/YouTubeNode';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { FigureNode } from './nodes/FigureNode';
import FigurePlugin from './plugins/FigurePlugin';
import { EmbedVideoNode } from './nodes/EmbedVideoNode';
import EmbedVideoPlugin from './plugins/EmbedVideoPlugin';
import { AutoLoadPlugin } from './plugins/AutoLoadPlugin';
import { AutoSavePlugin } from './plugins/AutoSavePlugin';

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
    embedBlock: {
        base: 'htmleditor-editor-embedBlock',
        focus: 'htmleditor-editor-embedBlock-focus',
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
    // inlineImage: 'htmleditor-theme-inline-image',
    figure: 'htmleditor-theme-figure',
    embedVideo: 'htmleditor-theme-embed-video',
    indent: 'htmleditor-theme-style-indent'
};


// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
    console.error(error);
}

interface IEditroProps {
    toolbarsSetup?: EditorToolbarsSetup;
    inputData: IAppInputData;
}

export default function Editor({ inputData, toolbarsSetup = setupDefault }: IEditroProps): JSX.Element {
    const initialConfig = {
        namespace: 'Starcheck-html-editor',
        theme: theme,
        onError: onError,
        nodes: [
            HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode, YouTubeNode, FigureNode, EmbedVideoNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <EditorWrapper>
                <TopToolbar settings={toolbarsSetup} inputData={inputData} />
                <RichTextWrapper>
                    <RichTextPlugin
                        contentEditable={<MuiContentEditable />}
                        placeholder={<PlaceholderWrapper text="Click here to enter text..." />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </RichTextWrapper>
            </EditorWrapper>
            <AutoLoadPlugin inputData={inputData} />
            <AutoSavePlugin inputData={inputData} />
            <LinkPlugin />
            <TabIndentationPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <YouTubePlugin />
            <FigurePlugin />
            <HistoryPlugin />
            <ClearEditorPlugin />
            {/* <TreeViewPlugin /> */}
            <EmbedVideoPlugin />
        </LexicalComposer>
    );
}
