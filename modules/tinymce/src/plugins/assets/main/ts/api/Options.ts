import Editor from "tinymce/core/api/Editor";
import { EditorOptions } from "tinymce/core/api/OptionTypes";

export interface UserAssetEntry {
  readonly keywords?: string[];
  readonly char: string;
  readonly category?: string;
}

const DEFAULT_ID = "tinymce.plugins.assets";

const option: {
  <K extends keyof EditorOptions>(name: K): (
    editor: Editor
  ) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) => editor.options.get(name);

const register = (editor: Editor, pluginUrl: string): void => {
  const registerOption = editor.options.register;

  registerOption("assets_database", {
    processor: "string",
    default: "emojis",
  });

  registerOption("assets_database_url", {
    processor: "string",
    default: `${pluginUrl}/js/${getAssetsDatabase(editor)}${editor.suffix}.js`,
  });

  registerOption("assets_database_id", {
    processor: "string",
    default: DEFAULT_ID,
  });

  registerOption("assets_append", {
    processor: "array",
    default: [],
  });

  registerOption("assets_images_url", {
    processor: "string",
    default: "https://twemoji.maxcdn.com/v/13.0.1/72x72/",
  });
};

const getAssetsDatabase = option<string>("assets_database");
const getAssetDatabaseUrl = option<string>("assets_database_url");
const getAssetDatabaseId = option<string>("assets_database_id");
const getAppendedAsset = option<UserAssetEntry[]>("assets_append");
const getAssetImageUrl = option("assets_images_url");

export {
  getAppendedAsset, getAssetDatabaseId,
  getAssetDatabaseUrl, getAssetImageUrl,
  getAssetsDatabase, register
};

