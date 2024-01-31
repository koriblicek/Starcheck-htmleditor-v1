import { Divider, Stack } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ButtonsDivider from './groups/ButtonsDivider';
import ElementTypeSelectionGroup from './groups/ElementTypeSelectionGroup';
import FormattingTextButtonsGroup from './groups/FormattingTextButtonsGroup';
import FormattingElementButtonsGroup from './groups/FormattingElementButtonsGroup';
import HistoryGroup from './groups/HistoryGroup';
import IndentationGroup from './groups/IndentationGroup';
import LinkButton from './groups/LinkButton';
import StyleTextButtonsGroup from './groups/StyleTextButtonsGroup';
import ColorTextButtonsGroup from './groups/ColorTextButtonsGroup';
import ImageButton from './groups/ImageButton';

const toolbarSx = {
    p: .5,
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'white',
    overflow: 'auto',
    scrollbarWidth: 'thin'
};

export default function TopToolbar(): JSX.Element {

    const [editor] = useLexicalComposerContext();

    return (
        <>
            <Stack direction="column" sx={toolbarSx}>
                <Stack flexDirection="row" gap={.5} justifyContent='left' sx={{ pb: .5 }}>
                    <HistoryGroup
                        editor={editor}
                        include={['undo', 'redo']}
                    />
                    <ButtonsDivider />
                    <StyleTextButtonsGroup
                        editor={editor}
                        fontFamilyList={
                            [
                                { name: "Default font", family: "" },
                                { name: "Arial", family: "'Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'" },
                                { name: "Calibri", family: "'Calibri', 'Candara', 'Segoe', 'Segoe UI', 'Optima', 'Arial', 'sans-serif'" },
                                { name: "Courier New", family: "'Courier New', 'Courier', 'Lucida Sans Typewriter', 'Lucida', 'Typewriter', 'monospace'" },
                                { name: "Verdana", family: "'Verdana', 'Geneva', 'sans-serif'" }
                            ]
                        }
                        fontFamilyListWidth="90px"
                        fontSizeList={[[8, "8px"], [9, "9px"], [10, "10px"], [11, "11px"], [12, "12px"], [14, "14px"], [16, "16px"], [18, "18px"], [20, "20px"], [22, "22px"], [24, "24px"], [26, "26px"], [28, "28px"], [36, "36px"], [48, "48px"], [72, "72px"]]}
                        fontSizeListWidth="24px"
                    />
                    <ColorTextButtonsGroup
                        editor={editor}
                        include={['font_color', 'background_color']}
                    />
                    <FormattingTextButtonsGroup
                        editor={editor}
                        buttons={['bold', 'italic', 'underline', 'clear_text_format']}
                        grouppedButtons={['strikethrough', 'code', 'subscript', 'superscript', 'highlight']}
                    />
                </Stack>
                <Divider sx={{ mb: 0.5 }} />
                <Stack flexDirection="row" gap={1} justifyContent='left'>
                    <ElementTypeSelectionGroup
                        editor={editor}
                        buttons={['bullet', 'number']}
                        grouppedButtons={['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'check', 'quote']}
                        grouppedButtonsWidth='110px'
                    />
                    <ButtonsDivider />
                    <LinkButton
                        editor={editor}
                    />
                    <ImageButton
                        editor={editor}
                    />
                    <ButtonsDivider />
                    <IndentationGroup
                        editor={editor}
                        include={['outdent', 'indent']}
                    />
                    <ButtonsDivider />
                    <FormattingElementButtonsGroup
                        editor={editor}
                        include={['left', 'center', 'right', 'justify', '']}
                    />
                </Stack>
            </Stack >
            <Divider />

            {/* <Grid container sx={toolbarPluginSx} columnGap={.5} rowGap={.5} alignItems='center' direction='row' wrap='nowrap'>
                <Grid item>
                    <HistoryGroup editor={editor} include={['undo', 'redo']} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <FormattingTextButtonsGroup editor={editor} buttons={['bold', 'italic', 'underline', 'clear_text_format']} grouppedButtons={['strikethrough', 'code', 'subscript', 'superscript', 'highlight']} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <StyleTextButtonsGroup editor={editor} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <LinkButton editor={editor} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <ElementTypeSelectionGroup editor={editor} buttons={['bullet', 'number']} grouppedButtons={['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'check', 'quote']} grouppedButtonsWidth='110px' />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <IndentationGroup editor={editor} include={['outdent', 'indent']} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
                <Grid item>
                    <FormattingElementButtonsGroup editor={editor} include={['left', 'center', 'right', 'justify', '']} />
                </Grid>
                <Grid item>
                    <ButtonsDivider />
                </Grid>
            </Grid> */}
        </>
    );
}
