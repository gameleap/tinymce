import Editor from "tinymce/core/api/Editor";

import { AssetEntry, initDatabase } from "../core/AssetsDatabase";
import * as Filters from "../core/Filters";
import * as Autocompletion from "../ui/Autocompletion";
import * as Buttons from "../ui/Buttons";
import * as Commands from "./Commands";
import * as Options from "./Options";

export interface AssetsApi {
  readonly loadAssets: (assets?: AssetEntry[]) => void;
}

const get = (editor: Editor): AssetsApi => ({
  loadAssets: (assets: AssetEntry[] = []) => {
    const databaseUrl = Options.getAssetDatabaseUrl(editor);
    const databaseId = Options.getAssetDatabaseId(editor);
    const database = initDatabase(editor, databaseUrl, databaseId);

    database.loadAssets(assets);

    Commands.register(editor, database);
    Buttons.register(editor);
    Autocompletion.init(editor, database);
    Filters.setup(editor);
  },
});

export { get };
