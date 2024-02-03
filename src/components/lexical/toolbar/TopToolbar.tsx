import { Divider, Stack } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorElementAlignmentGroup, EditorElementIndentationGroup, EditorElementTypeGroup, EditorFontSelection, EditorFontSizeSelection, EditorHistoryGroupType, EditorImageSelection, EditorLinkButton, EditorTextBackgroundColorSelection, EditorTextColorSelection, EditorTextFormattingGroupType, EditorTopGroupsType, EditorYouTubeButton } from 'src/types';
import { Fragment } from 'react';
import ButtonsDivider from './groups/ButtonsDivider';
import HistoryGroup from './groups/HistoryGroup';
import LinkButton from './groups/LinkButton';
import FontSelection from './groups/FontSelection';
import FontSizeSelection from './groups/FontSizeSelection';
import TextColorSelection from './groups/TextColorSelection';
import TextBackgroundColorSelection from './groups/TextBackgroundColorSelection';
import TextFormattingGroup from './groups/TextFormattingGroup';
import ElementTypeGroup from './groups/ElementTypeGroup';
import ElementAlignmentGroup from './groups/ElementAlignmentGroup';
import ElementIndentationGroup from './groups/ElementIndentationGroup';
import ImageSelection from './groups/ImageSelection';
import YouTubeButton from './groups/YouTubeButton';

const toolbarSx = {
    p: .5,
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'white',
    overflow: 'auto',
    scrollbarWidth: 'thin'
};

interface ITopToolbarProps {
    settings?: EditorTopGroupsType[];
}
export default function TopToolbar({ settings }: ITopToolbarProps): JSX.Element {

    const [editor] = useLexicalComposerContext();

    const toolbars = settings?.map((row, index) => {
        const groups = Object.keys(row).map((key, jndex) => {
            if (key === 'historyGroup') {
                const hg = (row['historyGroup'] as EditorHistoryGroupType);
                return (
                    <Fragment key={key + jndex}>
                        {hg.startDivider && <ButtonsDivider />}
                        <HistoryGroup
                            editor={editor}
                            buttons={hg.buttons}
                            groupedButtons={hg.groupedButtons}
                        />
                        {hg.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'fontSelection') {
                const fs = (row['fontSelection'] as EditorFontSelection);
                return (
                    <Fragment key={key + jndex}>
                        {fs.startDivider && <ButtonsDivider />}
                        <FontSelection
                            editor={editor}
                            fontsFamilyList={fs.fontsFamilyList}
                            fixedWidth={fs.fixedWidth}
                        />
                        {fs.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'fontSizeSelection') {
                const fss = (row['fontSizeSelection'] as EditorFontSizeSelection);
                return (
                    <Fragment key={key + jndex}>
                        {fss.startDivider && <ButtonsDivider />}
                        <FontSizeSelection
                            editor={editor}
                            fontSizeList={fss.fontSizeList}
                            fixedWidth={fss.fixedWidth}
                        />
                        {fss.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'textColorSelection') {
                const tcs = (row['textColorSelection'] as EditorTextColorSelection);
                return (
                    <Fragment key={key + jndex}>
                        {tcs.startDivider && <ButtonsDivider />}
                        <TextColorSelection
                            editor={editor}
                        />
                        {tcs.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'textBackgroundColorSelection') {
                const tbcs = (row['textBackgroundColorSelection'] as EditorTextBackgroundColorSelection);
                return (
                    <Fragment key={key + jndex}>
                        {tbcs.startDivider && <ButtonsDivider />}
                        <TextBackgroundColorSelection
                            editor={editor}
                        />
                        {tbcs.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'textFormattingGroup') {
                const tf = (row['textFormattingGroup'] as EditorTextFormattingGroupType);
                return (
                    <Fragment key={key + jndex}>
                        {tf.startDivider && <ButtonsDivider />}
                        <TextFormattingGroup
                            editor={editor}
                            buttons={tf.buttons}
                            groupedButtons={tf.groupedButtons}
                        />
                        {tf.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'elementTypeGroup') {
                const et = (row['elementTypeGroup'] as EditorElementTypeGroup);
                return (
                    <Fragment key={key + jndex}>
                        {et.startDivider && <ButtonsDivider />}
                        <ElementTypeGroup
                            editor={editor}
                            buttons={et.buttons}
                            groupedButtons={et.groupedButtons}
                            fixedWidth={et.fixedWidth}
                        />
                        {et.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'elementAlignmentGroup') {
                const ea = (row['elementAlignmentGroup'] as EditorElementAlignmentGroup);
                return (
                    <Fragment key={key + jndex}>
                        {ea.startDivider && <ButtonsDivider />}
                        <ElementAlignmentGroup
                            editor={editor}
                            buttons={ea.buttons}
                            groupedButtons={ea.groupedButtons}
                        />
                        {ea.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'elementIndentationGroup') {
                const ei = (row['elementIndentationGroup'] as EditorElementIndentationGroup);
                return (
                    <Fragment key={key + jndex}>
                        {ei.startDivider && <ButtonsDivider />}
                        <ElementIndentationGroup
                            editor={editor}
                            buttons={ei.buttons}
                            groupedButtons={ei.groupedButtons}
                        />
                        {ei.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'linkButton') {
                const ei = (row['linkButton'] as EditorLinkButton);
                return (
                    <Fragment key={key + jndex}>
                        {ei.startDivider && <ButtonsDivider />}
                        <LinkButton
                            editor={editor}
                        />
                        {ei.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'imageSelection') {
                const is = (row['imageSelection'] as EditorImageSelection);
                return (
                    <Fragment key={key + jndex}>
                        {is.startDivider && <ButtonsDivider />}
                        <ImageSelection
                            editor={editor}
                        />
                        {is.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            if (key === 'youTubeButton') {
                const yb = (row['youTubeButton'] as EditorYouTubeButton);
                return (
                    <Fragment key={key + jndex}>
                        {yb.startDivider && <ButtonsDivider />}
                        <YouTubeButton
                            editor={editor}
                        />
                        {yb.endDivider && <ButtonsDivider />}
                    </Fragment>
                );
            }
            return null;
        });
        return (
            <Fragment key={index}>
                <Stack flexDirection="row" gap={.5} justifyContent='left' sx={{ pb: .5 }}>
                    {groups}
                </Stack>
                {(index !== settings.length - 1) && <Divider sx={{ mb: 0.5 }} />}
            </Fragment>
        );
    });
    return (
        <>
            <Stack direction="column" sx={toolbarSx}>
                {toolbars}
            </Stack >
            <Divider />
        </>
    );
}