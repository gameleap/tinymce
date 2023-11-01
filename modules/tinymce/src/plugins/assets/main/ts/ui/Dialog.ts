import { Arr, Cell, Optional, Throttler } from "@ephox/katamari";
import { TinyMCE } from "tinymce/core/api/PublicApi";

import Editor from "tinymce/core/api/Editor";
import { Dialog } from "tinymce/core/api/ui/Ui";

import { insertAsset } from "../core/Actions";
import {
  ALL_CATEGORY,
  AssetsDatabase
} from "../core/AssetsDatabase";
import { assetsFrom } from "../core/Lookup";

declare let tinymce: TinyMCE;

interface DialogData {
  readonly pattern: string;
  readonly results: Array<{
    text: string;
    type: string;
    value: string;
    icon: string;
    label: string;
    items: any;
  }>;
}

const patternName = "pattern";

const open = (editor: Editor, database: AssetsDatabase): void => {
  const initialState: DialogData = {
    pattern: "",
    results: assetsFrom(database.listAll(), "", Optional.some(300)),
  };

  const currentTab = Cell(ALL_CATEGORY);

  const scan = (dialogApi: Dialog.DialogInstanceApi<DialogData>) => {
    const dialogData = dialogApi.getData();
    const category = currentTab.get();
    const candidates = database.listCategory(category);
    const results = assetsFrom(
      candidates,
      dialogData[patternName],
      category === ALL_CATEGORY ? Optional.some(300) : Optional.none()
    );
    dialogApi.setData({
      results,
    });
  };

  const updateFilter = Throttler.last((dialogApi) => {
    scan(dialogApi);
  }, 200);

  const searchField: Dialog.BodyComponentSpec = {
    label: "Search",
    type: "input",
    name: patternName,
  };

  const resultsField: Dialog.BodyComponentSpec = {
    type: "collection",
    name: "results",
    // TODO TINY-3229 implement collection columns properly
    // columns: 'auto'
  };

  const getInitialState = (): Dialog.DialogSpec<DialogData> => {
    const body: Dialog.TabPanelSpec = {
      type: "tabpanel",
      // All tabs have the same fields.
      tabs: Arr.map(database.listCategories(), (cat) => ({
        title: cat,
        name: cat,
        items: [searchField, resultsField],
      })),
    };
    return {
      title: "Assets",
      size: "large",
      body,
      initialData: initialState,
      onTabChange: (dialogApi, details) => {
        currentTab.set(details.newTabName);
        updateFilter.throttle(dialogApi);
      },
      onChange: updateFilter.throttle,
      onAction: (dialogApi, actionData) => {
        if (actionData.name === "results") {
          insertAsset(editor, actionData.value);
          dialogApi.close();
        }
      },
      buttons: [
        {
          type: "cancel",
          text: "Close",
          primary: true,
        },
      ],
    };
  };

  const dialogApi = editor.windowManager.open(getInitialState());

  dialogApi.focus(patternName);

  const element = document.getElementsByClassName("tox-dialog__title")[0];
  const title = element.innerHTML;

  // must be the anchor plugin
  if (title == "Assets") {
    setTimeout(() => {
      document
        .getElementsByClassName("tox-dialog")[0]
        .classList.add("assets-dialog");
    });
  }

  if (!database.hasLoaded()) {
    dialogApi.block("Loading assets...");
    database
      .waitForLoad()
      .then(() => {
        dialogApi.redial(getInitialState());
        updateFilter.throttle(dialogApi);
        dialogApi.focus(patternName);
        dialogApi.unblock();
      })
      .catch((_err) => {
        dialogApi.redial({
          title: "Assets",
          body: {
            type: "panel",
            items: [
              {
                type: "alertbanner",
                level: "error",
                icon: "warning",
                text: "Could not load assets",
              },
            ],
          },
          buttons: [
            {
              type: "cancel",
              text: "Close",
              primary: true,
            },
          ],
          initialData: {
            pattern: "",
            results: [],
          },
        });
        dialogApi.focus(patternName);
        dialogApi.unblock();
      });
  }
};

export { open };
