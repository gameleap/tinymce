import { TinyMCE } from "tinymce/core/api/PublicApi";

declare let tinymce: TinyMCE;
let config: any = {
  selector: "textarea.tinymce",
  plugins: "assets emoticons image code",
  toolbar: "assets emoticons image code",
  extended_valid_elements:
    "img[longdesc|usemap|src|border|alt=|title|hspace|vspace|width|height|align|data-path|style|class|loading=lazy|decoding=async]",
  height: 600,
};

tinymce.init(config);

setTimeout(() => {
  tinymce?.EditorManager.activeEditor?.plugins.assets.loadAssets([
    {
      key: "ana",
      name: "Ana",
      src: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3429c394716364bbef802180e9763d04812757c205e1b4568bc321772096ed86.png",
      category: "Heroes",
      alt: "This is the Alt",
      keywords: [],
      width: 50,
      height: 50,
    },
    {
      name: "Wraith Band",
      keywords: ["wraith", "band"],
      category: "Items",
      src: "https://cdn.gameleap.com/images/articles/art_gwgIj5AT1y/art-img_xgoFsYH3c/1x.webp",
      width: 50,
      height: 50,
    },
  ]);
}, 5000);

export { };

