let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');
let { UIMenuTextWidget } = require('./ui_menu_text_widget');
let { UIMenuWidget } = require('./ui_menu_widget');

class UIPromptWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIPromptWidget',
      template: `
      <div class="UIPromptWidget-text"></div>
      <div class="UIPromptWidget-menu"></div>`
    });

    this.menu = new UIMenuWidget({ columns: Infinity });
    this.node.querySelector('.UIPromptWidget-menu').replaceWith(this.menu.node);
    eventManager.subscribe(this.menu, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  update(ts) {
    this.menu.update(ts);
  }

  delete() {
    this.menu.delete();
    super.delete();
  }

  focus() {
    this.menu.focus();
    super.focus();
  }

  unfocus() {
    this.menu.unfocus();
    super.unfocus();
  }

  setText(text) {
    this.node.querySelector('.UIPromptWidget-text').textContent = text;
  }

  setActions(actions) {
    this.menu.clear();
    for (let action of actions) {
      this.menu.addItemWidget(new UIMenuTextWidget({ text: action }));
    }
  }

  handleMenuItemSelected(data) {
    eventManager.emit(this, 'E_MENU_ITEM_SELECTED', data);
  }
}

module.exports.UIPromptWidget = UIPromptWidget;