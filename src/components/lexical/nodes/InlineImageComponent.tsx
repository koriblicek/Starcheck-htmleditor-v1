/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Float } from './InlineImageNode';
import type { BaseSelection, NodeKey } from 'lexical';

import './InlineImageNode.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { $isInlineImageNode } from './InlineImageNode';

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

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  float
}: {
  altText: string;
  className: string | null;
  height: 'inherit' | number;
  imageRef: { current: null | HTMLImageElement; };
  src: string;
  width: 'inherit' | number;
  float: Float;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        display: 'inline-block',
        height,
        width,
        float: float
      }}
    />
  );
}
/*
export function UpdateInlineImageDialog({
  activeEditor,
  nodeKey,
  onClose,
}: {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  onClose: () => void;
}): JSX.Element {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(
    () => $getNodeByKey(nodeKey) as InlineImageNode,
  );
  const [altText, setAltText] = useState(node.getAltText());
  const [showCaption, setShowCaption] = useState(node.getShowCaption());
  const [position, setPosition] = useState<Position>(node.getPosition());

  const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowCaption(e.target.checked);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value as Position);
  };

  const handleOnConfirm = () => {
    const payload = {altText, position, showCaption};
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };

  return (
    <>
      <div style={{marginBottom: '1em'}}>
        <TextInput
          label="Alt Text"
          placeholder="Descriptive alternative text"
          onChange={setAltText}
          value={altText}
          data-test-id="image-modal-alt-text-input"
        />
      </div>

      <Select
        style={{marginBottom: '1em', width: '208px'}}
        value={position}
        label="Position"
        name="position"
        id="position-select"
        onChange={handlePositionChange}>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="full">Full Width</option>
      </Select>

      <div className="Input__wrapper">
        <input
          id="caption"
          type="checkbox"
          checked={showCaption}
          onChange={handleShowCaptionChange}
        />
        <label htmlFor="caption">Show Caption</label>
      </div>

      <DialogActions>
        <Button
          data-test-id="image-modal-file-upload-btn"
          onClick={() => handleOnConfirm()}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}
*/
export default function InlineImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  float
}: {
  altText: string;
  height: 'inherit' | number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
  float: Float;

}): JSX.Element {
  // const [modal, showModal] = useModal();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isInlineImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      /*
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      */
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
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
  return (
    <Suspense fallback={null}>
      <>
        {/*<div draggable={draggable}>
           <button
            className="image-edit-button"
            ref={buttonRef} }
          onClick={() => {
            showModal('Update Inline Image', (onClose) => (
              <UpdateInlineImageDialog
                activeEditor={editor}
                nodeKey={nodeKey}
                onClose={onClose}
              />
            ));
          }}
          >
            Edit
          </button> */}
        <LazyImage
          className={
            isFocused
              ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
              : null
          }
          src={src}
          altText={altText}
          imageRef={imageRef}
          width={width}
          height={height}
          float={float}
        />
      </>
      {/* {modal} */}
    </Suspense>
  );
}