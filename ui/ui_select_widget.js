let { eventManager } = require('../event/event_manager');
let { UIMenuWidget, MenuAxisEnum } = require('./ui_menu_widget');

class UISelectWidget extends UIMenuWidget {
  constructor() {
    super({
      className: 'UISelectWidget',
      axis: MenuAxisEnum.X
    });

    this.index = -1;
    eventManager.subscribe(this, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  setValue(index) {
    if (index == this.index) {
      return;
    }

    this.unselectItem();
    this.selectItem(index, false);
    this.index = index;
  }

  addItem(text) {
    super.addItem(`<button class="UISelectWidget-item">${text}</button>`);
  }

  removeItem(index) {
    super.removeItem(index);
  }

  handleMenuItemSelected() {
    this.index = this.getSelectedItemIndex();
    eventManager.emit(this, 'E_VALUE_CHANGED', { index: this.index });
  }
}

module.exports.UISelectWidget = UISelectWidget;