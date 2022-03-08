let { eventManager } = require('../event/event_manager');
let { UIMenuWidget } = require('./ui_menu_widget');

class UICollectionMenuWidget extends UIMenuWidget {
  constructor(options = {}) {
    super(options);
    this.items = new Collection();
    this.itemArray = [];
    this.sortPredicate = () => true;
    this.filterPredicate = () => true;
    this.enablePredicate = () => true;
  }

  delete() {
    eventManager.unsubscribe(this.items, 'E_ITEM_ADDED', this);
    eventManager.unsubscribe(this.items, 'E_ITEM_REMOVED', this);
    super.delete();
  }

  setItems(items) {
    eventManager.unsubscribe(this.items, 'E_ITEM_ADDED', this);
    eventManager.unsubscribe(this.items, 'E_ITEM_REMOVED', this);
    this.clear();

    if (items) {
      let itemArray = items.sort(this.sortPredicate).filter(this.filterPredicate);
      itemArray.forEach(item => this.addItem(item, this.enablePredicate(item)));
      eventManager.subscribe(items, 'E_ITEM_ADDED', this, this.handleItemAdded);
      eventManager.subscribe(items, 'E_ITEM_REMOVED', this, this.handleItemRemoved);
      this.items = items;
      this.itemArray = itemArray;
    }
    else {
      this.items = new Collection();
      this.itemArray = [];
    }
  }

  getFocusedItem() {
    return this.itemArray[this.getFocusedItemIndex()];
  }

  getSelectedItem() {
    return this.itemArray[this.getSelectedItemIndex()];
  }

  setSortPredicate(sortPredicate) {
    if (this.items) {
      this.clear();
      this.itemArray = this.items.sort(sortPredicate).filter(this.filterPredicate);
      this.itemArray.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.sortPredicate = sortPredicate;
  }

  setFilterPredicate(filterPredicate) {
    if (this.items) {
      this.clear();
      this.itemArray = this.items.sort(this.sortPredicate).filter(filterPredicate);
      this.itemArray.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.filterPredicate = filterPredicate;
  }

  setEnablePredicate(enablePredicate) {
    if (this.items) {
      this.clear();
      this.itemArray = this.items.sort(this.sortPredicate).filter(this.filterPredicate);
      this.itemArray.forEach(item => this.addItem(item, enablePredicate(item)));
    }

    this.enablePredicate = enablePredicate;
  }

  handleItemAdded(data) {
    this.itemArray = this.items.sort(this.sortPredicate).filter(this.filterPredicate);
    let index = this.itemArray.indexOf(data.item);
    this.addItem(data.item, this.enablePredicate(data.item), index);
  }

  handleItemRemoved(data) {
    let index = this.itemArray.indexOf(data.item);
    this.itemArray = this.items.sort(this.sortPredicate).filter(this.filterPredicate);
    this.removeItem(index);
  }
}

module.exports.UICollectionMenuWidget = UICollectionMenuWidget;