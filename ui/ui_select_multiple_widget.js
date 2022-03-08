let { eventManager } = require('../event/event_manager');
let { UIMenuWidget, MenuAxisEnum } = require('./ui_menu_widget');

class UISelectMultipleWidget extends UIMenuWidget {
  constructor() {
    super({
      className: 'UISelectMultipleWidget',
      axis: MenuAxisEnum.X,
      multiple: true
    });

    this.indexes = new Collection();
    eventManager.subscribe(this, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  setValues(indexes) {
    if (indexes == this.indexes) {
      return;
    }

    this.unselectItems();
    indexes.forEach(index => this.selectItem(index, false));
    this.indexes = indexes;
  }

  addItem(text) {
    super.addItem(`<button class="UISelectMultipleWidget-item">${text}</button>`);
  }

  removeItem(index) {
    super.removeItem(index);
  }

  handleMenuItemSelected() {
    this.indexes = this.getSelectedItemIndexes();
    eventManager.emit(this, 'E_VALUES_CHANGED', { indexes: this.indexes });
  }
}

module.exports.UISelectMultipleWidget = UISelectMultipleWidget;