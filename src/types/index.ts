import { TextFormatType, ElementFormatType } from "lexical";
import { HeadingTagType } from '@lexical/rich-text';
import { ListType } from '@lexical/list';
import { CSSProperties } from "react";

export const APP_NAME = "APIHTMLEDITOR";
export const APP_LANGUAGES = ["sk", "gb"];

//#region APP
//Input data via div/scriptst
export interface IAppInputData {
    dataApiLink: string;
    dataCssLink: string;
    dataRestApiLink: string;
    dataDbKey: string;
    dataId: string;
    dataModule: string;
    dataVersion: string;
    dataLoadOnStart: boolean;
}

//Settings from API
export interface IAppData {
    imagesURL: string;
}
//#endregion

export const ICON_SIZE: number = .9;
export const linkAttributeTartgetTypeList: LinkAttributeTartgetType[] = ["_self", "_blank", "_parent", "_top"];

export type LinkAttributeTartgetType = "_self" | "_blank" | "_parent" | "_top";

export type LinkData = {
    url: string;
    target: string | null;
    title: string | null;
};

export type NewImagePayload = {
    src: string;
};

export type NewEmbedVideoPayload = {
    videoUrl: string;
    posterUrl: string;
};

export type SaveRestApiPayload = {
    data: string;
    html: string;
    timestamp: number;
};

export type Float = CSSProperties["float"] | undefined;
export type Width = CSSProperties["width"];
export type Height = CSSProperties["height"];

//----------
//#region ActionsGroup
export type ActionsType = "clear" | "preview" | "save_local_storage" | "load_local_storage" | "save_rest" | "load_rest";
export type EditorActionsGroupType = {
    buttons?: ActionsType[];
    groupedButtons?: ActionsType[];
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
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
export type ElementReadOnlyType = "youtube" | "root" | "inline-image" | "figure" | "embed-video";
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
//#region VideoSelection
export type VideoType = "youtube" | "embed-video";
export type EditorVideoSelection = {
    startDivider?: boolean;
    endDivider?: boolean;
};
//#endregion
export type EditorTopGroupsType = {
    actionsGroup?: EditorActionsGroupType;
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
    videoSelection?: EditorVideoSelection;
};
export type EditorToolbarsSetup = {
    toolbar: EditorTopGroupsType[];
};

export const defaultToolbarsSetup: EditorToolbarsSetup = { toolbar: [] };