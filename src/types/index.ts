import { TextFormatType, ElementFormatType } from "lexical";
import { HeadingTagType } from '@lexical/rich-text';
import { ListType } from '@lexical/list';

export const ICON_SIZE: number = .9;
export const linkAttributeTartgetTypeList: LinkAttributeTartgetType[] = ["_self", "_blank", "_parent", "_top"];


export type ClearTextFormatType = "clear_text_format";
export type RecordTextFormatType = Record<TextFormatType | ClearTextFormatType, boolean>;

export type RecordElementFormatType = Record<ElementFormatType, boolean>;

export type ActionsType = "clear";
export type RecordActionsType = Record<ActionsType, boolean>;

export type HistoryType = "redo" | "undo" | "clear_history";
export type RecordHistoryType = Record<HistoryType, boolean>;

export type IndentationType = "outdent" | "indent";
export type RecordIndentationType = Record<IndentationType, boolean>;

export type ColorType = "font_color" | "background_color";
export type RecordColorType = Record<ColorType, boolean>;

export type ElementTypeSelectionTypeParagraph = "paragraph";
export type ElementTypeSelectionTypeQuote = "quote";
export type ElementTypeSelectionType = ElementTypeSelectionTypeParagraph | HeadingTagType | ElementTypeSelectionTypeQuote | ListType;
export type RecordElementTypeSelectionType = Record<ElementTypeSelectionType, boolean>;

export type LinkAttributeTartgetType = "_self" | "_blank" | "_parent" | "_top";
export type LinkData = {
    url: string;
    target: string | null;
    title: string | null;
};

export type NewImagePayload = {
    src: string;
    altText: string;
};


export type FontFamilyListType = {
    name: string,
    family: string;
};
export type StyleTextData = {
    font: string;
    size: number | null;
};
//export type RecordStyleText = Record<