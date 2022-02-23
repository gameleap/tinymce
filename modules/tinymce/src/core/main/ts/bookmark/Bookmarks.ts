import EditorSelection from '../api/dom/Selection';
import * as NodeType from '../dom/NodeType';
import { Bookmark } from './BookmarkTypes';
import * as GetBookmark from './GetBookmark';
import * as ResolveBookmark from './ResolveBookmark';

const getBookmark = (selection: EditorSelection, type: number, normalized: boolean): Bookmark => {
  return GetBookmark.getBookmark(selection, type, normalized);
};

const moveToBookmark = (selection: EditorSelection, bookmark: Bookmark): void => {
  ResolveBookmark.resolve(selection, bookmark).each((rng) => {
    selection.setRng(rng);
  });
};

const isBookmarkNode = (node: Node): boolean => {
  return NodeType.isElement(node) && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark';
};

export {
  getBookmark,
  moveToBookmark,
  isBookmarkNode
};
