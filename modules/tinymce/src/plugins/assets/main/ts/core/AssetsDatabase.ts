import { Obj, Optional, Singleton } from "@ephox/katamari";

import Editor from "tinymce/core/api/Editor";

import * as Options from "../api/Options";

const ALL_CATEGORY = "All";

interface RawAssetEntry {
  readonly keywords: string[];
  readonly src: string;
}

export interface AssetEntry extends RawAssetEntry {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly classes?: string[];
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface AssetsDatabase {
  readonly listCategory: (category: string) => AssetEntry[];
  readonly hasLoaded: () => boolean;
  readonly waitForLoad: () => Promise<boolean>;
  readonly listAll: () => AssetEntry[];
  readonly listCategories: () => string[];
  readonly loadAssets: (assets?: AssetEntry[]) => void;
}

const categoryNameMap = {
  symbols: "Symbols",
  people: "People",
  animals_and_nature: "Animals and Nature",
  food_and_drink: "Food and Drink",
  activity: "Activity",
  travel_and_places: "Travel and Places",
  objects: "Objects",
  flags: "Flags",
  user: "User Defined",
};

const translateCategory = (
  categories: Record<string, string>,
  name: string
): string => (Obj.has(categories, name) ? categories[name] : name);

const getUserDefinedAssets = (editor: Editor): any => {
  const userDefinedAssets = Options.getAppendedAsset(editor);
  return userDefinedAssets.map((value) =>
    // Set some sane defaults for the custom assets entry
    ({ keywords: [], category: "Custom", ...value })
  );
};

// TODO: Consider how to share this loading across different editors
const initDatabase = (
  editor: Editor,
  databaseUrl: string,
  databaseId: string
): AssetsDatabase => {
  const categories = Singleton.value<Record<string, AssetEntry[]>>();
  const all = Singleton.value<AssetEntry[]>();

  const processAssets = (assets: AssetEntry[]) => {
    const cats: Record<string, AssetEntry[]> = {};
    const everything: AssetEntry[] = [];

    assets.map((entry: AssetEntry) => {
      entry = {
        ...entry,
        category: translateCategory(categoryNameMap, entry.category),
      };

      const current =
        cats[entry.category] !== undefined ? cats[entry.category] : [];
      cats[entry.category] = current.concat([entry]);
      everything.push(entry);
    });

    categories.set(cats);
    all.set(everything);
  };

  editor.on("init", () => {
    loadAssets();
  });

  const listCategory = (category: string): AssetEntry[] => {
    if (category === ALL_CATEGORY) {
      return listAll();
    }
    return categories
      .get()
      .bind((cats) => Optional.from(cats[category]))
      .getOr([]);
  };

  const listAll = (): AssetEntry[] => all.get().getOr([]);

  const listCategories = (): string[] =>
    // TODO: Category key order should be adjusted to match the standard
    [ALL_CATEGORY].concat(Obj.keys(categories.get().getOr({})));

  const waitForLoad = (): Promise<boolean> => {
    if (hasLoaded()) {
      return Promise.resolve(true);
    } else {
      return new Promise((resolve, reject) => {
        let numRetries = 15;
        const interval = setInterval(() => {
          if (hasLoaded()) {
            clearInterval(interval);
            resolve(true);
          } else {
            numRetries--;
            if (numRetries < 0) {
              // eslint-disable-next-line no-console
              console.log("Could not load assets from url: " + databaseUrl);
              clearInterval(interval);
              reject(false);
            }
          }
        }, 100);
      });
    }
  };

  const hasLoaded = (): boolean => categories.isSet() && all.isSet();

  const loadAssets = (assets: AssetEntry[] = []) => {
    const userAssets = getUserDefinedAssets(editor);
    processAssets([...userAssets, ...assets]);

    // Resource.load(databaseId, databaseUrl).then(
    //   (assets) => {

    //   },
    //   (err) => {
    //     // eslint-disable-next-line no-console
    //     console.log(`Failed to load assets: ${err}`);
    //     categories.set({});
    //     all.set([]);
    //   }
    // );
  };

  return {
    listCategories,
    hasLoaded,
    waitForLoad,
    listAll,
    listCategory,
    loadAssets,
  };
};

// Load the script.

export { ALL_CATEGORY, initDatabase };
