import Editor from 'tinymce/core/api/Editor';

const insertAsset = (editor: Editor, ch: string): void => {
  editor.insertContent(ch);
};

export {
  insertAsset
};
