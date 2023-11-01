import { Optional } from '@ephox/katamari';

import Editor from 'tinymce/core/api/Editor';

import { AssetsDatabase } from '../core/AssetsDatabase';
import { assetsFrom } from '../core/Lookup';

const init = (editor: Editor, database: AssetsDatabase): void => {
  editor.ui.registry.addAutocompleter('assets', {
    trigger: '/',
    columns: 'auto',
    minChars: 2,
    
    fetch: (pattern, maxResults) => database.waitForLoad().then(() => {
      const candidates: any = database.listAll();
      return assetsFrom(candidates, pattern, Optional.some(maxResults)) as any;
    }),
    onAction: (autocompleteApi, rng, value) => {
      editor.selection.setRng(rng);
      editor.insertContent(value);
      autocompleteApi.hide();
    }
  });

};

export {
  init
};
