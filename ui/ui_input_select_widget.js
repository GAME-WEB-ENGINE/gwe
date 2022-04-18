let { eventManager } = require('../event/event_manager');
let { UIMenuTextWidget } = require('./ui_menu_text_widget');
let { UIMenuWidget } = require('./ui_menu_widget');

class UIInputSelectWidget extends UIMenuWidget {
  constructor() {
    super({
      className: 'UIInputSelectWidget',
      columns: Infinity
    });

    this.index = -1;
    eventManager.subscribe(this, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  setValue(index) {
    if (index == this.index) {
      return;
    }

    this.unselectItemWidgets();
    this.selectItemWidget(index, false);
    this.index = index;
  }

  addItem(text) {
    this.addItemWidget(new UIMenuTextWidget({ text: text }));
  }

  handleMenuItemSelected() {
    this.index = this.getSelectedItemWidgetIndex();
    eventManager.emit(this, 'E_VALUE_CHANGED', { index: this.index });
  }
}

class UIInputSelectMultipleWidget extends UIMenuWidget {
  constructor() {
    super({
      className: 'UIInputSelectMultipleWidget',
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

    this.unselectItemWidgets();
    indexes.forEach(index => this.selectItemWidget(index, false));
    this.indexes = indexes;
  }

  addItem(text) {
    super.addItemWidget(new UIMenuTextWidget({ text: text }));
  }

  handleMenuItemSelected() {
    this.indexes = this.getSelectedItemWidgetIndexes();
    eventManager.emit(this, 'E_VALUES_CHANGED', { indexes: this.indexes });
  }
}

module.exports.UIInputSelectWidget = UIInputSelectWidget;
module.exports.UIInputSelectMultipleWidget = UIInputSelectMultipleWidget;