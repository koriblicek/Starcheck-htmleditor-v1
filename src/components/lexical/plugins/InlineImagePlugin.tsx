//import '../../ui/Checkbox.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createInlineImageNode,
  InlineImageNode,
  InlineImagePayload,
} from '../nodes/InlineImageNode';

export type InsertInlineImagePayload = Readonly<InlineImagePayload>;

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> = createCommand('INSERT_INLINE_IMAGE_COMMAND');

/*
export function InsertInlineImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const hasModifier = useRef(false);

  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const [position, setPosition] = useState<Position>('left');

  const isDisabled = src === '';

  const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowCaption(e.target.checked);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value as Position);
  };

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const handleOnClick = () => {
    const payload = {altText, position, showCaption, src};
    activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      <div style={{marginBottom: '1em'}}>
        <FileInput
          label="Image Upload"
          onChange={loadImage}
          accept="image/*"
          data-test-id="image-modal-file-upload"
        />
      </div>
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
        style={{marginBottom: '1em', width: '290px'}}
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
          disabled={isDisabled}
          onClick={() => handleOnClick()}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}
*/
export default function InlineImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([InlineImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand<InsertInlineImagePayload>(
      INSERT_INLINE_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createInlineImageNode(payload);
        $insertNodes([imageNode]);
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;
