import Editor from 'tinymce/core/api/Editor';

import { AssetsDatabase } from '../core/AssetsDatabase';
import * as Dialog from '../ui/Dialog';

const register = (editor: Editor, database: AssetsDatabase): void => {
  editor.addCommand('mceAssets', () => Dialog.open(editor, database));
};

export {
  register
};
