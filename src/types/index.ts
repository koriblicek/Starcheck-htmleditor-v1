import { TextFormatType, ElementFormatType } from "lexical";
import { HeadingTagType } from '@lexical/rich-text';
import { ListType } from '@lexical/list';
import { CSSProperties } from "react";

export const APP_NAME = "APIHTMLEDITOR";
export const APP_LANGUAGES = ["sk", "gb"];

export const LOCAL_STORAGE_DATA_PREFIX = "starcheck-htmleditor-v1-data";


export enum EnumUiTemplates {
    "DEVELOPER_CONDENSED" = "dev-condensed"
}
//#region APP
//Input data via div/scriptst
export interface IAppInputData {
    dataApiLink: string;
    dataCssLink: string;
    dataUiTemplate: EnumUiTemplates;
    dataFormItemId: string;
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

export const setupDevCondensed: EditorToolbarsSetup = {
    toolbar: [
        {
            historyGroup: {
                startDivider: false,
                buttons: ['undo', 'redo'],
                groupedButtons: [],
                endDivider: true
            },
            actionsGroup: {
                startDivider: false,
                buttons: ['preview', 'clear'], //'load_rest', 'save_rest',
                groupedButtons: ["load_local_storage", "save_local_storage"],
                endDivider: true
            }
        },
        {
            fontSelection: {
                startDivider: false,
                fontsFamilyList: [
                    { name: "Default font", family: '' },
                    { name: "Arial", family: '"Arial", "Helvetica Neue", "Helvetica", "sans-serif"' },
                    { name: "Calibri", family: '"Calibri", "Candara", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif"' },
                    { name: "Courier New", family: '"Courier New", "Courier", "Lucida Sans Typewriter", "Lucida", "Typewriter", "monospace"' },
                    { name: "Verdana", family: '"Verdana", "Geneva", "sans-serif"' }
                ],
                fixedWidth: '100px',
                endDivider: false
            },
            fontSizeSelection: {
                startDivider: false,
                fontSizeList: [
                    [8, "8px"],
                    [9, "9px"],
                    [10, "10px"],
                    [11, "11px"],
                    [12, "12px"],
                    [14, "14px"],
                    [16, "16px"],
                    [18, "18px"],
                    [20, "20px"],
                    [22, "22px"],
                    [24, "24px"],
                    [26, "26px"],
                    [28, "28px"],
                    [36, "36px"],
                    [48, "48px"],
                    [72, "72px"]
                ],
                fixedWidth: '25px',
                endDivider: true
            },
            textColorSelection: {
                startDivider: false,
                endDivider: false
            },
            textBackgroundColorSelection: {
                startDivider: false,
                endDivider: true
            },
            textFormattingGroup: {
                startDivider: false,
                buttons: ['bold', 'italic', 'underline', 'code', 'clear_text_formatting'],
                groupedButtons: ['strikethrough', 'subscript', 'superscript', 'highlight'],
                endDivider: true
            },
            linkButton: {
                startDivider: false,
                endDivider: false
            },
            imageSelection: {
                startDivider: false,
                endDivider: true
            },
            videoSelection: {
                startDivider: false,
                endDivider: false
            }
        },
        {
            elementTypeGroup: {
                startDivider: false,
                buttons: ['bullet', 'number', 'h1', 'h2', 'h3', 'quote'],
                groupedButtons: ['paragraph', 'h4', 'h5', 'h6', 'check'],
                fixedWidth: '160px',
                endDivider: true
            },
            elementIndentationGroup: {
                startDivider: false,
                buttons: ['indent', 'outdent'],
                groupedButtons: [],
                endDivider: true
            },
            elementAlignmentGroup: {
                startDivider: false,
                buttons: ['left', 'center', 'right', 'justify', 'clear_alignment'],
                groupedButtons: [],
                endDivider: false
            }
        }
    ]
};

export const setupDefault: EditorToolbarsSetup = { toolbar: [] };