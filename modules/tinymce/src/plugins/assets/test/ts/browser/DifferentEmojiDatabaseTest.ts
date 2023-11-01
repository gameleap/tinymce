import { UiFinder, Waiter } from '@ephox/agar';
import { before, describe, it } from '@ephox/bedrock-client';
import { Arr } from '@ephox/katamari';
import { SugarBody } from '@ephox/sugar';
import { McEditor, TinyUiActions } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'tinymce/core/api/Editor';
import Plugin from 'tinymce/plugins/assets/Plugin';

const getFilename = (url: string) => {
  const m = /([^\/\\]+)$/.exec(url);
  if (m !== null) {
    return m[1];
  }
  return '';
};

describe('browser.tinymce.plugins.assets.DifferentEmojiDatabaseTest', () => {
  before(() => {
    Plugin();
  });

  const pTestEditorWithSettings = async (categories: string[], databaseUrl: string) => {
    const editor = await McEditor.pFromSettings<Editor>({
      plugins: 'assets',
      toolbar: 'assets',
      base_url: '/project/tinymce/js/tinymce',
      assets_database_url: databaseUrl,
      assets_database_id: 'tinymce.plugins.assets.' + getFilename(databaseUrl)
    });

    TinyUiActions.clickOnToolbar(editor, 'button');
    await TinyUiActions.pWaitForDialog(editor);
    await Waiter.pTryUntil(
      'Wait for emojis to load',
      () => UiFinder.notExists(SugarBody.body(), '.tox-spinner')
    );

    const tabs = UiFinder.findAllIn(SugarBody.body(), '[role="tab"]');
    const actualCategories = Arr.map(tabs, (elm) => elm.dom.textContent);
    assert.deepEqual(actualCategories, categories, 'Categories match');
    McEditor.remove(editor);
  };

  it('TBA: Loading databases from different urls ', async () => {
    await pTestEditorWithSettings([ 'All', 'People' ], '/project/tinymce/src/plugins/assets/test/js/test-emojis.js');
    await pTestEditorWithSettings([ 'All', 'Travel and Places' ], '/project/tinymce/src/plugins/assets/test/js/test-emojis-alt.js');
  });
});
