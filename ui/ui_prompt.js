let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');
let { UIMenuText } = require('./ui_menu_text');
let { UIMenu } = require('./ui_menu');
let { MenuAxisEnum } = require('./ui_menu');

class UIPrompt extends UIWidget {
  constructor() {
    super({
      className: 'UIPrompt',
      template: `
      <div class="UIPrompt-text"></div>
      <div class="UIPrompt-menu"></div>`
    });

    this.menu = new UIMenu({ axis: MenuAxisEnum.X });
    this.node.querySelector('.UIPrompt-menu').replaceWith(this.menu.node);
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
    this.node.querySelector('.UIPrompt-text').textContent = text;
  }

  setActions(actions) {
    this.menu.clear();
    for (let action of actions) {
      this.menu.addItemWidget(new UIMenuText({ text: action }));
    }
  }

  handleMenuItemSelected(data) {
    eventManager.emit(this, 'E_MENU_ITEM_SELECTED', data);
  }
}

module.exports.UIPrompt = UIPrompt;