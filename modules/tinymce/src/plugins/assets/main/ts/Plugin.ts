import PluginManager from 'tinymce/core/api/PluginManager';

import * as Commands from './api/Commands';
import * as Options from './api/Options';
import { initDatabase } from './core/AssetsDatabase';
import * as Filters from './core/Filters';
import * as Autocompletion from './ui/Autocompletion';
import * as Buttons from './ui/Buttons';

/**
 * This class contains all core logic for the assets plugin.
 *
 * @class tinymce.assets.Plugin
 * @private
 */

export default (): void => {
  PluginManager.add('assets', (editor, pluginUrl) => {
    Options.register(editor, pluginUrl);
    const databaseUrl = Options.getAssetDatabaseUrl(editor);
    const databaseId = Options.getAssetDatabaseId(editor);

    const database = initDatabase(editor, databaseUrl, databaseId);

    Commands.register(editor, database);
    Buttons.register(editor);
    Autocompletion.init(editor, database);
    Filters.setup(editor);
  });
};
