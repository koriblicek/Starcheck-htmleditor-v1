import type { Float, Height, Width } from './InlineImageNode';
import type { BaseSelection, NodeKey } from 'lexical';

import './InlineImageNode.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { $getNodeByKey, $getSelection, $isNodeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND } from 'lexical';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { $isInlineImageNode } from './InlineImageNode';
import { IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { EditInlineImageDialog } from './dialogs/EditInlineImageDialog';

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({ altText, className, imageRef, src, width, height, float }: {
  altText: string | null; className: string | null; height?: Height; imageRef: { current: null | HTMLImageElement; }; src: string; width?: Width; float: Float;
}): JSX.Element {

  useSuspenseImage(src);

  console.log(float);
  
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText ? altText : ""}
      ref={imageRef}
      style={{
        display: 'inline-block',
        height: `${height}`,
        width: `${width}`,
        // float: `${float}`,
        maxWidth: '100%',
      }}
    />
  );
}

export default function InlineImageComponent({ src, altText, nodeKey, width, height, float, caption }: {
  altText: string; height: Height; nodeKey: NodeKey; src: string; width: Width; float: Float; caption: string;
}): JSX.Element {
  // const [modal, showModal] = useModal();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<BaseSelection | null>(null);

  console.log(caption, selection)
  const onDelete = useCallback((payload: KeyboardEvent) => {
    if (isSelected && $isNodeSelection($getSelection())) {
      const event: KeyboardEvent = payload;
      event.preventDefault();
      const node = $getNodeByKey(nodeKey);
      if ($isInlineImageNode(node)) {
        node.remove();
      }
    }
    return false;
  }, [isSelected, nodeKey]);

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          console.log(event.target);
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW,)
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, /*onEnter, onEscape,*/ setSelected,]);

  const isFocused = isSelected;

  const onClose = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const editDialog = useMemo(() => {
    return (
      <EditInlineImageDialog editor={editor} nodeKey={nodeKey} open={isEditDialogOpen} onClose={onClose} />
    );
  }, [isEditDialogOpen, editor, nodeKey, onClose]);

  return (
    <Suspense fallback={null}>
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
        <div style={{ position: 'absolute', top: 5, left: 15, visibility: isFocused ? 'visible' : 'hidden' }} onClick={(e) => e.stopPropagation()}>
          <IconButton
            color="primary"
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "white" },
              "&:focus": { backgroundColor: "white" }
            }}
            title="Edit Figure"
            size='small'
            onClick={(e) => {
              setIsEditDialogOpen(true);
              e.stopPropagation();
            }}
          >
            <Icon path={mdiPencil} size={1} />
          </IconButton>
        </div>
        <LazyImage
          className={(isFocused ? `focused` : null)}
          src={src}
          altText={altText}
          imageRef={imageRef}
          width={width}
          height={height}
          float={float}
        />
      </div>
      {editDialog}
    </Suspense >
  );
}