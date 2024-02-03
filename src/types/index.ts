import { TextFormatType, ElementFormatType } from "lexical";
import { HeadingTagType } from '@lexical/rich-text';
import { ListType } from '@lexical/list';

export const ICON_SIZE: number = .9;
export const linkAttributeTartgetTypeList: LinkAttributeTartgetType[] = ["_self", "_blank", "_parent", "_top"];

export type ActionsType = "clear" | "preview";
export type RecordActionsType = Record<ActionsType, boolean>;


export type LinkAttributeTartgetType = "_self" | "_blank" | "_parent" | "_top";

export type LinkData = {
    url: string;
    target: string | null;
    title: string | null;
};

export type NewImagePayload = {
    src: string;
};

//export type RecordStyleText = Record<

//----------

//#region HistoryGroup
export type HistoryType = "redo" | "undo" | "clear_history";
export type EditorHistoryGroupType = {
    buttons?: HistoryType[];
    groupedButtons?: HistoryType[];
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region FontSelection
export type FontFamilyListType = {
    name: string,
    family: string;
};
export type EditorFontSelection = {
    fontsFamilyList?: FontFamilyListType[];
    fixedWidth?: string;
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region FontSizeSelection
export type FontSizeListType = [number, string][];
export type EditorFontSizeSelection = {
    fontSizeList?: FontSizeListType;
    fixedWidth?: string;
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region TextColor
export type EditorTextColorSelection = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region TextBackgroundColor
export type EditorTextBackgroundColorSelection = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region TextFormattingGroup
export type ClearTextFormatType = "clear_text_formatting";
export type TextFormattingType = TextFormatType | ClearTextFormatType;
export type EditorTextFormattingGroupType = {
    buttons?: TextFormattingType[];
    groupedButtons?: TextFormattingType[];
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region ElementTypeGroup
export type ElementTypeParagraph = "paragraph";
export type ElementTypeQuote = "quote";
export type ElementReadOnlyType = "youtube" | "root" | "inline-image";
export type ElementTypeType = ElementTypeParagraph | HeadingTagType | ElementTypeQuote | ListType;
export type EditorElementTypeGroup = {
    buttons?: ElementTypeType[];
    groupedButtons?: ElementTypeType[];
    fixedWidth?: string;
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region ElementAlignmentGroup
export type ElementAlignmentType = Exclude<ElementFormatType, ""> | "clear_alignment";
export type EditorElementAlignmentGroup = {
    buttons?: ElementAlignmentType[];
    groupedButtons?: ElementAlignmentType[];
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region ElementIndentationGroup
export type ElementIndentationType = "outdent" | "indent";
export type EditorElementIndentationGroup = {
    buttons?: ElementIndentationType[];
    groupedButtons?: ElementIndentationType[];
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region LinkButton
export type EditorLinkButton = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region ImageSelection
export type EditorImageSelection = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
//#region YouTubeButton
export type EditorYouTubeButton = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
export type EditorTopGroupsType = {
    historyGroup?: EditorHistoryGroupType;
    fontSelection?: EditorFontSelection;
    fontSizeSelection?: EditorFontSizeSelection;
    textColorSelection?: EditorTextColorSelection;
    textBackgroundColorSelection?: EditorTextBackgroundColorSelection;
    textFormattingGroup?: EditorTextFormattingGroupType;
    elementTypeGroup?: EditorElementTypeGroup;
    elementAlignmentGroup?: EditorElementAlignmentGroup;
    elementIndentationGroup?: EditorElementIndentationGroup;
    linkButton?: EditorLinkButton;
    imageSelection?: EditorImageSelection;
    youTubeButton?: EditorYouTubeButton;
};
export type EditorToolbarsSetup = {
    top?: EditorTopGroupsType[];
    bottom?: string;
};

export const defaultToolbarsSetup: EditorToolbarsSetup = {};