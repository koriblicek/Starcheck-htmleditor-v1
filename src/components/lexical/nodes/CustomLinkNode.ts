import { LinkNode, LinkAttributes } from '@lexical/link';
import { $getSelection, $isElementNode, $isRangeSelection, EditorConfig, ElementNode, LexicalCommand, LexicalNode, NodeKey, SerializedElementNode, Spread, createCommand } from 'lexical';
import utils from "@lexical/utils";

type SerializedCustomLinkNode = Omit<Spread<LinkAttributes & LinkClassAttribute, SerializedElementNode>, "url"> & { url: string; };

export type LinkClassAttribute = {
  classes?: string | null | undefined;
};

export const TOGGLE_CUSTOM_LINK_COMMAND: LexicalCommand<string | ({ url: string; } & LinkAttributes & LinkClassAttribute) | null> = createCommand();

export class CustomLinkNode extends LinkNode {
  __classes: null | string;

  constructor(url: string, attributes: LinkAttributes & LinkClassAttribute = {}, key?: NodeKey) {
    super(url, attributes, key);
    const { classes = null } = attributes;
    this.__classes = classes;
  }

  getClasses(): null | string {
    return this.getLatest().__classes;
  }

  setClasses(classes: null | string): void {
    const writable = this.getWritable();
    writable.__classes = classes;
  }

  static getType() {
    return "custom-link";
  }

  static clone(node: CustomLinkNode) {
    return new CustomLinkNode(node.__url, { target: node.getTarget(), rel: node.getRel(), title: node.getTitle(), classes: node.getClasses() }, node.__key);
  }

  createDOM(config: EditorConfig) {
    const element = super.createDOM(config);
    if (this.__classes !== null) {
      utils.addClassNamesToElement(element, this.__classes);
    }
    return element;
  }

  updateDOM(prevNode: CustomLinkNode, anchor: HTMLAnchorElement, config: EditorConfig): boolean {
    super.updateDOM(prevNode, anchor, config);

    const classes = this.__classes;

    if (classes !== prevNode.__classes) {
      if (classes) {
        anchor.className = classes;
      } else {
        anchor.removeAttribute('class');
      }
    }
    return false;
  }

  static importJSON(serializedNode: SerializedCustomLinkNode) {
    const node = $createCustomLinkNode(serializedNode.url, {
      rel: serializedNode.rel,
      target: serializedNode.target,
      title: serializedNode.title,
      classes: serializedNode.classes
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON() {
    const json = {
      ...super.exportJSON(),
      type: this.getType(),
      classes: this.getClasses()
    };
    return json;
  }
}

export function $createCustomLinkNode(url: string, attributes?: LinkAttributes & LinkClassAttribute) {
  return new CustomLinkNode(url, attributes);
}

export function $isCustomLinkNode(
  node: LexicalNode | null | undefined,
): node is CustomLinkNode {
  return node instanceof CustomLinkNode;
}

export function toggleCustomLink(
  url: null | string,
  attributes: LinkAttributes & LinkClassAttribute = {},
): void {
  const { target, title, classes } = attributes;
  const rel = attributes.rel === undefined ? 'noreferrer' : attributes.rel;
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();

  if (url === null) {
    // Remove LinkNodes
    nodes.forEach((node) => {
      const parent = node.getParent();

      if ($isCustomLinkNode(parent)) {
        const children = parent.getChildren();

        for (let i = 0; i < children.length; i++) {
          parent.insertBefore(children[i]);
        }

        parent.remove();
      }
    });
  } else {
    // Add or merge LinkNodes
    if (nodes.length === 1) {
      const firstNode = nodes[0];
      // if the first node is a LinkNode or if its
      // parent is a LinkNode, we update the URL, target and rel.
      const linkNode = $getAncestor(firstNode, $isCustomLinkNode);
      if (linkNode !== null) {
        linkNode.setURL(url);
        if (target !== undefined) {
          linkNode.setTarget(target);
        }
        if (rel !== null) {
          linkNode.setRel(rel);
        }
        if (title !== undefined) {
          linkNode.setTitle(title);
        }
        if (classes !== undefined) {
          linkNode.setClasses(classes);
        }
        return;
      }
    }

    let prevParent: ElementNode | CustomLinkNode | null = null;
    let linkNode: CustomLinkNode | null = null;

    nodes.forEach((node) => {
      const parent = node.getParent();

      if (
        parent === linkNode ||
        parent === null ||
        ($isElementNode(node) && !node.isInline())
      ) {
        return;
      }

      if ($isCustomLinkNode(parent)) {
        linkNode = parent;
        parent.setURL(url);
        if (target !== undefined) {
          parent.setTarget(target);
        }
        if (rel !== null) {
          linkNode.setRel(rel);
        }
        if (title !== undefined) {
          linkNode.setTitle(title);
        }
        if (classes !== undefined) {
          linkNode.setClasses(classes);
        }
        return;
      }

      if (!parent.is(prevParent)) {
        prevParent = parent;
        linkNode = $createCustomLinkNode(url, { rel, target, title, classes });

        if ($isCustomLinkNode(parent)) {
          if (node.getPreviousSibling() === null) {
            parent.insertBefore(linkNode);
          } else {
            parent.insertAfter(linkNode);
          }
        } else {
          node.insertBefore(linkNode);
        }
      }

      if ($isCustomLinkNode(node)) {
        if (node.is(linkNode)) {
          return;
        }
        if (linkNode !== null) {
          const children = node.getChildren();

          for (let i = 0; i < children.length; i++) {
            linkNode.append(children[i]);
          }
        }

        node.remove();
        return;
      }

      if (linkNode !== null) {
        linkNode.append(node);
      }
    });
  }
}

function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType,
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}