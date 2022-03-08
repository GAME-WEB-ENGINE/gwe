let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');

let MenuAxisEnum = {
  X: 0,
  Y: 1,
  XY: 2
};

let MenuFocusEnum = {
  AUTO: 0,
  NONE: 1
};

class UIMenuWidget extends UIWidget {
  constructor(options = {}) {
    super(options);
    this.axis = options.axis || MenuAxisEnum.Y;
    this.multiple = options.multiple || false;
    this.selectable = options.selectable || true;
    this.focusedItem = null;
    this.selectedItems = [];
  }

  focus(focusIndex = MenuFocusEnum.AUTO) {
    if (focusIndex == MenuFocusEnum.AUTO && !this.focusedItem) {
      this.focusItem(0);
    }
    else if (focusIndex == MenuFocusEnum.AUTO && this.focusedItem) {
      this.focusItem(this.getFocusedItemIndex());
    }
    else if (focusIndex >= 0) {
      this.focusItem(focusIndex);
    }

    super.focus();
  }

  getFocusedItemIndex() {
    return Array.from(this.node.children).indexOf(this.focusedItem);
  }

  getSelectedItemIndex() {
    return Array.from(this.node.children).indexOf(this.selectedItems[0]);
  }

  getSelectedItemIndexes() {
    return this.selectedItems.map((item) => Array.from(this.node.children).indexOf(item));
  }

  findItem(fields) {
    for (let i = 0; i < this.node.children.length; i++) {
      let match = true;
      for (let key in fields) {
        match = (this.node.children[i].dataset[key] == fields[key]) && match;
      }
      if (match) {
        return i;
      }
    }

    return -1;
  }

  addItem(htmlFrag, enabled = true, index = -1, dataset = {}) {
    let tpl = document.createElement('template');
    tpl.innerHTML = htmlFrag;

    if (index == -1) {
      this.node.appendChild(tpl.content);
      Object.assign(this.node.lastChild.dataset, dataset);
    }
    else {
      this.node.insertBefore(tpl.content, this.node.children[index]);
      Object.assign(this.node.children[index].dataset, dataset);
    }

    this.setItemEnabled(index == -1 ? this.node.children.length - 1 : index, enabled);
  }

  removeItem(index) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIMenuWidget::removeItem(): item not found !');
    }

    if (this.selectedItems.indexOf(item) != -1) {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }
    if (this.focusedItem == item) {
      this.focusedItem = null;
    }

    this.node.removeChild(item);
  }

  focusItem(index, preventScroll = false, emit = true) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIMenuWidget::focusItem(): item not found !');
    }

    if (!preventScroll) {
      let rect = this.getViewRectItem(index);
      if (rect.top < 0) {
        this.node.scrollTop += rect.top;
      }
      if (rect.bottom > this.node.clientHeight) {
        this.node.scrollTop += rect.bottom - this.node.clientHeight;
      }
    }

    this.unfocusItem();
    item.classList.add(this.className + '-item--focused');
    this.focusedItem = item;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_FOCUSED', { item: item, index: index });
    }
  }

  unfocusItem(emit = true) {
    if (!this.focusedItem) {
      return;
    }

    this.focusedItem.classList.remove(this.className + '-item--focused');
    this.focusedItem = null;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNFOCUSED');
    }
  }

  selectItem(index, emit = true) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIMenuWidget::selectItem(): item not found !');
    }

    if (item.classList.contains(this.className + '-item--disabled')) {
      return;
    }

    if (this.multiple && this.selectedItems.indexOf(item) != -1) {
      this.unselectItem(index);
      return;
    }

    if (!this.multiple) {
      this.unselectItems();
    }

    item.classList.add(this.className + '-item--selected');
    this.selectedItems.push(item);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_SELECTED', { item: item, index: index });
    }
  }

  unselectItem(index, emit = true) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIMenuWidget::unselectItem(): item not found !');
    }

    if (this.selectedItems.indexOf(item) == -1) {
      return;
    }

    item.classList.remove(this.className + '-item--selected');
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNSELECTED', { item: item, index: index });
    }
  }

  unselectItems(emit = true) {
    this.selectedItems.forEach((item) => item.classList.remove(this.className + '-item--selected'));
    this.selectedItems = [];
    
    if (emit) {
      eventManager.emit(this, 'E_MENU_UNSELECTED');
    }
  }

  setItemEnabled(index, enabled = true, emit = true) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIMenuWidget::setItemEnabled(): item not found !');
    }

    if (enabled) {
      item.classList.remove(this.className + '-item--disabled');
      if (emit) eventManager.emit(this, 'E_MENU_ITEM_ENABLED', { item: item, index: index });
    }
    else {
      item.classList.add(this.className + '-item--disabled');
      if (emit) eventManager.emit(this, 'E_MENU_ITEM_DISABLED', { item: item, index: index });
    }
  }

  isItemEnabled(index) {
    let item = this.node.children[index];
    return item.classList.contains(this.className + '-item--disabled');
  }

  clear() {
    this.node.innerHTML = '';
    this.focusedItem = null;
    this.selectedItems = [];
  }

  close() {
    this.unselectItems();
    this.unfocusItem();
    this.hide();
  }

  getViewRectItem(index) {
    let top = this.node.children[index].offsetTop - this.node.scrollTop;
    let bottom = top + this.node.children[index].offsetHeight;
    return { top, bottom };
  }

  onKeyDownOnce(data) {
    let focusedIndex = this.getFocusedItemIndex();
    if (data.key == KEY_CANCEL) {
      eventManager.emit(this, 'E_CLOSED');
    }
    if (data.key == KEY_ENTER) {
      eventManager.emit(this, 'E_ENTER_PRESSED');
    }
    if (data.key == KEY_ENTER && this.selectable && focusedIndex != -1) {
      this.selectItem(focusedIndex);
    }

    if (this.axis == MenuAxisEnum.Y && data.key == KEY_UP) {
      let prevIndex = (focusedIndex - 1 < 0) ? this.node.children.length - 1 : focusedIndex - 1;
      this.focusItem(prevIndex);
    }
    else if (this.axis == MenuAxisEnum.Y && data.key == KEY_DOWN) {
      let nextIndex = (focusedIndex + 1 > this.node.children.length - 1) ? 0 : focusedIndex + 1;
      this.focusItem(nextIndex);
    }

    if (this.axis == MenuAxisEnum.X && data.key == KEY_LEFT) {
      let prevIndex = (focusedIndex - 1 < 0) ? this.node.children.length - 1 : focusedIndex - 1;
      this.focusItem(prevIndex);
    }
    else if (this.axis == MenuAxisEnum.X && data.key == KEY_RIGHT) {
      let nextIndex = (focusedIndex + 1 > this.node.children.length - 1) ? 0 : focusedIndex + 1;
      this.focusItem(nextIndex);
    }

    if (this.axis == MenuAxisEnum.XY && data.key == KEY_LEFT) {
      let prevIndex = (focusedIndex - 1 < 0) ? this.node.children.length - 1 : focusedIndex - 1;
      this.focusItem(prevIndex);
    }
    else if (this.axis == MenuAxisEnum.XY && data.key == KEY_UP) {
      let prevIndex = (focusedIndex - 2 < 0) ? this.node.children.length - 1 : focusedIndex - 2;
      this.focusItem(prevIndex);
    }
    else if (this.axis == MenuAxisEnum.XY && data.key == KEY_RIGHT) {
      let nextIndex = (focusedIndex + 1 > this.node.children.length - 1) ? 0 : focusedIndex + 1;
      this.focusItem(nextIndex);
    }
    else if (this.axis == MenuAxisEnum.XY && data.key == KEY_DOWN) {
      let nextIndex = (focusedIndex + 2 > this.node.children.length - 1) ? 0 : focusedIndex + 2;
      this.focusItem(nextIndex);
    }
  }
}

module.exports.MenuAxisEnum = MenuAxisEnum;
module.exports.MenuFocusEnum = MenuFocusEnum;
module.exports.UIMenuWidget = UIMenuWidget;