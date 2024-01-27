import { TextFormatType, ElementFormatType } from "lexical";
import { HeadingTagType } from '@lexical/rich-text';

export const ICON_SIZE: number = 0.8;
export type ClearTextFormatType = "clear_text_format";
export type RecordTextFormatType = Record<TextFormatType | ClearTextFormatType, boolean>;

export type RecordElementFormatType = Record<ElementFormatType, boolean>;

export type ActionsType = "clear";
export type RecordActionsType = Record<ActionsType, boolean>;

export type HistoryType = "redo" | "undo" | "clear_history";
export type RecordHistoryType = Record<HistoryType, boolean>;

export type IndentationType = "outdent" | "indent";
export type RecordIndentationType = Record<IndentationType, boolean>;

export type ElementTypeSelectionTypeParagraph = "paragraph";
export type ElementTypeSelectionTypeQuote = "quote";
export type ElementTypeSelectionTypeOptional = HeadingTagType | ElementTypeSelectionTypeQuote;
export type ElementTypeSelectionType = ElementTypeSelectionTypeParagraph | ElementTypeSelectionTypeOptional;
export type RecordElementTypeSelectionType = Record<ElementTypeSelectionType, boolean>;