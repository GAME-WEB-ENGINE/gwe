let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

let MenuFocusEnum = {
  AUTO: 0,
  NONE: 1
};

class UIMenuWidget extends UIWidget {
  constructor(options = {}) {
    super({
      className: options.className || 'UIMenuWidget'
    });

    this.rows = options.rows != undefined ? options.rows : 1;
    this.columns = options.columns != undefined ? options.columns : 1;
    this.multiple = options.multiple != undefined ? options.multiple : false;
    this.selectable = options.selectable != undefined ? options.selectable : true;
    this.itemWidgets = [];
    this.focusedItemWidget = null;

    if (this.columns == Infinity) {
      this.node.style.grid = 'repeat(' + this.rows + ', auto) / auto-flow';
    }
    else if (this.rows == Infinity) {
      this.node.style.grid = 'auto-flow / repeat(' + this.columns + ', auto)';
    }
    else {
      this.node.style.grid = 'repeat(' + this.rows + ', auto) / repeat(' + this.columns + ', auto)';
    }
  }

  update(ts) {
    for (let itemWidget of this.itemWidgets) {
      itemWidget.update(ts);
    }
  }

  focus(focusIndex = MenuFocusEnum.AUTO) {
    if (focusIndex == MenuFocusEnum.AUTO && !this.focusedItemWidget) {
      this.focusItemWidget(0);
    }
    else if (focusIndex == MenuFocusEnum.AUTO && this.focusedItemWidget) {
      this.focusItemWidget(this.getFocusedItemWidgetIndex());
    }
    else if (focusIndex >= 0) {
      this.focusItemWidget(focusIndex);
    }

    super.focus();
  }

  getFocusedItemWidgetIndex() {
    return this.itemWidgets.indexOf(this.focusedItemWidget);
  }

  getSelectedItemWidgetIndex() {
    return this.itemWidgets.findIndex(itemWidget => itemWidget.isSelected());
  }

  getSelectedItemWidgetIndexes() {
    return this.itemWidgets.map(itemWidget => itemWidget.isSelected());
  }

  addItemWidget(itemWidget, enabled = true, index = -1) {
    if (index == -1) {
      this.itemWidgets.push(itemWidget);
      this.node.appendChild(itemWidget.node);
    }
    else {
      this.itemWidgets.splice(index + 1, 0, itemWidget);
      this.node.insertBefore(itemWidget.node, this.node.children[index]);
    }

    itemWidget.setEnabled(enabled);
  }

  removeItemWidget(index) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::removeItemWidget(): itemWidget not found !');
    }

    if (this.focusedItemWidget == itemWidget) {
      this.focusedItemWidget = null;
    }

    this.itemWidgets.splice(this.itemWidgets.indexOf(itemWidget), 1);
    itemWidget.delete();
  }

  focusItemWidget(index, preventScroll = false, emit = true) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::focusItemWidget(): itemWidget not found !');
    }

    if (!preventScroll) {
      let rect = this.getViewRectItemWidget(index);
      if (rect.top < 0) {
        this.node.scrollTop += rect.top;
      }
      if (rect.bottom > this.node.clientHeight) {
        this.node.scrollTop += rect.bottom - this.node.clientHeight;
      }
    }

    if (this.focusedItemWidget) {
      this.focusedItemWidget.unfocus();
    }
    
    itemWidget.focus();
    this.focusedItemWidget = itemWidget;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_FOCUSED', { itemWidget: itemWidget, index: index });
    }
  }

  unfocusItemWidget(emit = true) {
    if (!this.focusedItemWidget) {
      return;
    }

    this.focusedItemWidget.unfocus();
    this.focusedItemWidget = null;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNFOCUSED');
    }
  }

  selectItemWidget(index, emit = true) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::selectItemWidget(): itemWidget not found !');
    }
    if (!itemWidget.isEnabled()) {
      return;
    }

    if (this.multiple && itemWidget.isSelected()) {
      itemWidget.setSelected(false);
      return;
    }

    if (!this.multiple) {
      this.itemWidgets.forEach(itemWidget => itemWidget.setSelected(false));
    }

    itemWidget.setSelected(true);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_SELECTED', { itemWidget: itemWidget, index: index });
    }
  }

  unselectItemWidget(index, emit = true) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::unselectItemWidget(): itemWidget not found !');
    }
    if (!itemWidget.isSelected()) {
      return;
    }

    itemWidget.setSelected(false);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNSELECTED', { itemWidget: itemWidget, index: index });
    }
  }

  unselectItemWidgets(emit = true) {
    this.itemWidgets.forEach(itemWidget => itemWidget.setSelected(false));
    
    if (emit) {
      eventManager.emit(this, 'E_MENU_UNSELECTED');
    }
  }

  setItemWidgetEnabled(index, enabled = true, emit = true) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::setItemWidgetEnabled(): itemWidget not found !');
    }

    itemWidget.setEnabled(enabled);

    if (emit) {
      eventManager.emit(this, enabled ? 'E_MENU_ITEM_ENABLED' : 'E_MENU_ITEM_DISABLED', { itemWidget: itemWidget, index: index });
    }
  }

  isItemWidgetEnabled(index) {
    let itemWidget = this.itemWidgets[index];
    if (!itemWidget) {
      throw new Error('UIMenuWidget::setItemWidgetEnabled(): itemWidget not found !');
    }

    return itemWidget.isEnabled();
  }

  clear() {
    this.itemWidgets.forEach(itemWidget => itemWidget.delete());
    this.itemWidgets = [];
    this.focusedItemWidget = null;
    this.node.innerHTML = '';
  }

  close() {
    this.unselectItemWidgets();
    this.unfocusItemWidget();
    this.hide();
  }

  getViewRectItemWidget(index) {
    let top = this.node.children[index].offsetTop - this.node.scrollTop;
    let bottom = top + this.node.children[index].offsetHeight;
    return { top, bottom };
  }

  onKeyDownOnce(data) {
    let focusedIndex = this.getFocusedItemWidgetIndex();
    if (data.key == InputKeyEnum.CANCEL) {
      eventManager.emit(this, 'E_CLOSED');
    }
    if (data.key == InputKeyEnum.ENTER) {
      eventManager.emit(this, 'E_ENTER_PRESSED');
    }
    if (data.key == InputKeyEnum.ENTER && this.selectable && focusedIndex != -1) {
      this.selectItemWidget(focusedIndex);
    }

    if (data.key == InputKeyEnum.LEFT) {
      let prevIndex = (focusedIndex - 1 < 0) ? this.itemWidgets.length - 1 : focusedIndex - 1;
      this.focusItemWidget(prevIndex);
    }
    else if (data.key == InputKeyEnum.RIGHT) {
      let nextIndex = (focusedIndex + 1 > this.itemWidgets.length - 1) ? 0 : focusedIndex + 1;
      this.focusItemWidget(nextIndex);
    }
    else if (data.key == InputKeyEnum.UP) {
      let prevIndex = (focusedIndex - this.columns < 0) ? this.itemWidgets.length - 1 : focusedIndex - this.columns;
      this.focusItemWidget(prevIndex);
    }
    else if (data.key == InputKeyEnum.DOWN) {
      let nextIndex = (focusedIndex + this.columns > this.itemWidgets.length - 1) ? 0 : focusedIndex + this.columns;
      this.focusItemWidget(nextIndex);
    }
  }
}

module.exports.MenuFocusEnum = MenuFocusEnum;
module.exports.UIMenuWidget = UIMenuWidget;