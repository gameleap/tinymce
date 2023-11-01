import Editor from 'tinymce/core/api/Editor';
import { Menu, Toolbar } from 'tinymce/core/api/ui/Ui';

const onSetupEditable = (editor: Editor) => (api: Toolbar.ToolbarButtonInstanceApi | Menu.MenuItemInstanceApi): VoidFunction => {
  const nodeChanged = () => {
    api.setEnabled(editor.selection.isEditable());
  };

  editor.on('NodeChange', nodeChanged);
  nodeChanged();

  return () => {
    editor.off('NodeChange', nodeChanged);
  };
};

const register = (editor: Editor): void => {
  const onAction = () => editor.execCommand('mceAssets');

  editor.ui.registry.addButton('assets', {
    tooltip: 'Assets',
    icon: 'temporary-placeholder',
    onAction,
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addMenuItem('assets', {
    text: 'Assets...',
    icon: 'temporary-placeholder',
    onAction,
    onSetup: onSetupEditable(editor)
  });
  
  // editor.ui.registry.addMenuItem('assets', {
  //   text: 'Assets...',
  //   icon: 'temporary-placeholder',
  //   onAction,
  //   onSetup: onSetupEditable(editor)
  // });
};

export {
  register
};
