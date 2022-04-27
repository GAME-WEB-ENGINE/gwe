let { eventManager } = require('../event/event_manager');
let { UIMenuText } = require('./ui_menu_text');
let { UIMenu } = require('./ui_menu');

class UIInputSelect extends UIMenu {
  constructor() {
    super({
      className: 'UIInputSelect',
      columns: Infinity
    });

    this.index = -1;
    eventManager.subscribe(this, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  setValue(index) {
    if (index == this.index) {
      return;
    }

    this.unselectWidgets();
    this.selectWidget(index, false);
    this.index = index;
  }

  addItem(text) {
    this.addWidget(new UIMenuText({ text: text }));
  }

  handleMenuItemSelected() {
    this.index = this.getSelectedWidgetIndex();
    eventManager.emit(this, 'E_VALUE_CHANGED', { index: this.index });
  }
}

class UIInputSelectMultiple extends UIMenu {
  constructor() {
    super({
      className: 'UIInputSelectMultiple',
      columns: Infinity,
      multiple: true
    });

    this.indexes = [];
    eventManager.subscribe(this, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  setValues(indexes) {
    if (indexes == this.indexes) {
      return;
    }

    this.unselectWidgets();
    indexes.forEach(index => this.selectWidget(index, false));
    this.indexes = indexes;
  }

  addItem(text) {
    super.addWidget(new UIMenuText({ text: text }));
  }

  handleMenuItemSelected() {
    this.indexes = this.getSelectedWidgetIndexes();
    eventManager.emit(this, 'E_VALUES_CHANGED', { indexes: this.indexes });
  }
}

module.exports.UIInputSelect = UIInputSelect;
module.exports.UIInputSelectMultiple = UIInputSelectMultiple;