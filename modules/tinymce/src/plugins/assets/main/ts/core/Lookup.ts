import { Arr, Fun, Optional, Strings } from "@ephox/katamari";

import { AssetEntry } from "./AssetsDatabase";

const assetMatches = (asset: AssetEntry, lowerCasePattern: string): boolean =>
  Strings.contains(asset.name.toLowerCase(), lowerCasePattern) ||
  Arr.exists(asset.keywords, (k) =>
    Strings.contains(k.toLowerCase(), lowerCasePattern)
  );

const assetsFrom = (
  list: AssetEntry[],
  pattern: string,
  maxResults: Optional<number>
): Array<{
  text: string;
  type: string;
  value: string;
  icon: string;
  label: string;
  category: string;
  items: any;
}> => {
  const matches = [];
  const lowerCasePattern = pattern.toLowerCase();
  const reachedLimit = maxResults.fold(
    () => Fun.never,
    (max) => (size) => size >= max
  );
  for (let i = 0; i < list.length; i++) {
    // TODO: more intelligent search by showing title matches at the top, keyword matches after that (use two arrays and concat at the end)
    if (pattern.length === 0 || assetMatches(list[i], lowerCasePattern)) {
      const width = list[i].width ? `width="${list[i].width}px"` : "";
      const height = list[i].height ? `height="${list[i].height}px"` : "";
      const dataId = list[i].id ? `data-id="${list[i].id}"` : "";
      const dataSlug = list[i].slug ? `data-slug="${list[i].slug}"` : "";
      const classes = list[i].classes
        ? `class="${list[i].classes?.join(" ")}"`
        : "";

      matches.push({
        text: list[i].name,
        type: "cardmenuitem",
        value: `<img ${classes} ${dataId} ${dataSlug} ${width} ${height} alt="${
          list[i].alt || list[i].name
        }" src="${list[i].src}">`,
        icon: `<img ${width} ${height} alt="${
          list[i].alt || list[i].name
        }" src="${list[i].src}">`,
        label: list[i].name,
        category: list[i].category,
        items: [
          {
            type: "cardimage",
            src: list[i].src,
            alt: list[i].alt || list[i].name,
            classes: [
              "asset-image",
              ...(list[i].classes || []),
            ],
          },
        ],
      });
      if (reachedLimit(matches.length)) {
        break;
      }
    }
  }
  return matches;
};

export { assetsFrom };
