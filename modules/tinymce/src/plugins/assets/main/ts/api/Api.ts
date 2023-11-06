import Editor from "tinymce/core/api/Editor";

import { AssetEntry, AssetsDatabase } from "../core/AssetsDatabase";

export interface AssetsApi {
  readonly loadAssets: (assets?: AssetEntry[]) => void;
}

const get = (editor: Editor, database: AssetsDatabase): AssetsApi => ({
  loadAssets: (assets: AssetEntry[] = []) => {
    database.loadAssets(assets);
  },
});

export { get };
