import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { PlaceholderWrapper } from './wrappers/PlaceholderWrapper';
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
// import TreeViewPlugin from './plugins/TreeViewPlugin';
import { FigureNode } from './nodes/FigureNode';
import FigurePlugin from './plugins/FigurePlugin';
import { EmbedVideoNode } from './nodes/EmbedVideoNode';
import EmbedVideoPlugin from './plugins/EmbedVideoPlugin';
import { AutoLoadPlugin } from './plugins/AutoLoadPlugin';
import { AutoSavePlugin } from './plugins/AutoSavePlugin';
import { GlobalStyles } from '@mui/material';
import { CustomLinkNode } from './nodes/CustomLinkNode';
import { CustomLinkPlugin } from './plugins/CustomLinkPlugin';
import { MuiContentEditable } from './wrappers/MuiContentEditable';
import { DivClearBothNode } from './nodes/DivClearBothNode';
import DivClearBothPlugin from './plugins/DivClearBothPlugin';
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin';
import { HorizontalRuleNode } from './nodes/HorizontalRuleNode';

const styles = {

    '.htmleditor-editor-embedBlock': {
        userSelect: 'none',
        cursor: 'pointer',
        outline: '1px rgb(202, 202, 202) dashed',
        // backgroundColor: 'white'
    },
    '.htmleditor-editor-embedBlock-focus': {
        outline: '2px solid #757ce8'
    },
    '.htmleditor-theme-nestedListItem': {
        listStyleType: 'none'
    }
};
const theme = {
    //     paragraph: "htmleditor-theme-paragraph",
    //     heading: {
    //         h1: "htmleditor-theme-heading-h1",
    //         h2: "htmleditor-theme-heading-h2",
    //         h3: "htmleditor-theme-heading-h3",
    //         h4: "htmleditor-theme-heading-h4",
    //         h5: "htmleditor-theme-heading-h5",
    //         h6: "htmleditor-theme-heading-h6"
    //     },
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
    //     quote: "htmleditor-theme-quote",
    //     text: {
    //         bold: "htmleditor-theme-text-bold",
    //         italic: "htmleditor-theme-text-italic",
    //         underline: "htmleditor-theme-text-underline",
    //         strikethrough: "htmleditor-theme-text-strikethrough",
    //         underlineStrikethrough: "htmleditor-theme-text-underline-strikethrough",
    //         subscript: "htmleditor-theme-text-subscript",
    //         superscript: "htmleditor-theme-text-superscript",
    //         code: "htmleditor-theme-text-code",
    //         highlight: "htmleditor-theme-text-highlight"
    //     },
    //     link: "htmleditor-theme-link",
    //     // inlineImage: 'htmleditor-theme-inline-image',
    //     figure: 'htmleditor-theme-figure',
    //     embedVideo: 'htmleditor-theme-embed-video',
    //     indent: 'htmleditor-theme-style-indent'
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
        namespace: 'Starcheck-html-editor' + inputData.dataFormItemId,
        theme: theme,
        onError: onError,
        nodes: [
            HeadingNode, QuoteNode, ListNode, ListItemNode, YouTubeNode, FigureNode, EmbedVideoNode, CustomLinkNode, DivClearBothNode, HorizontalRuleNode,
            {
                replace: LinkNode,
                with: (node: CustomLinkNode) => {
                    return new CustomLinkNode(node.__url, { target: node.getTarget(), title: node.getTitle(), rel: node.getRel() });
                }
            }
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <GlobalStyles styles={styles} />
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
            <CustomLinkPlugin />
            <TabIndentationPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <YouTubePlugin />
            <FigurePlugin />
            <HistoryPlugin />
            <ClearEditorPlugin />
            {/* <TreeViewPlugin /> */}
            <EmbedVideoPlugin />
            <DivClearBothPlugin />
            <HorizontalRulePlugin />
        </LexicalComposer>
    );
}
