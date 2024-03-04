import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { CustomLinkNode, TOGGLE_CUSTOM_LINK_COMMAND, toggleCustomLink } from "../nodes/CustomLinkNode";

type Props = {
  validateUrl?: (url: string) => boolean;
};

export function CustomLinkPlugin({ validateUrl }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CustomLinkNode])) {
      throw new Error(
        "SimpleLegislationPlugin: CustomLinkNode not registered on editor"
      );
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_CUSTOM_LINK_COMMAND, (payload) => {
        if (payload === null) {
          toggleCustomLink(payload);
          return true;
        } else if (typeof payload === 'string') {
          if (validateUrl === undefined || validateUrl(payload)) {
            toggleCustomLink(payload);
            return true;
          }
          return false;
        } else {
          const { url, target, rel, title, classes } = payload;
          toggleCustomLink(url, { rel, target, title, classes });
          return true;
        }
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, validateUrl]);

  return null;
}