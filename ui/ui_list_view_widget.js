let { eventManager } = require('../event/event_manager');
let { ArrayCollection } = require('../array/array_collection');
let { UIMenuWidget } = require('./ui_menu_widget');

class UIListViewWidget extends UIMenuWidget {
  constructor(options = {}) {
    super(options);
    this.collection = new ArrayCollection();
    this.items = [];
    this.sortPredicate = () => true;
    this.filterPredicate = () => true;
    this.enablePredicate = () => true;
  }

  delete() {
    eventManager.unsubscribe(this.collection, 'E_ITEM_ADDED', this);
    eventManager.unsubscribe(this.collection, 'E_ITEM_REMOVED', this);
    super.delete();
  }

  setCollection(collection) {
    eventManager.unsubscribe(this.collection, 'E_ITEM_ADDED', this);
    eventManager.unsubscribe(this.collection, 'E_ITEM_REMOVED', this);
    this.clear();

    if (collection) {
      let items = collection.sort(this.sortPredicate).filter(this.filterPredicate);
      items.forEach(item => this.addItem(item, this.enablePredicate(item)));
      eventManager.subscribe(collection, 'E_ITEM_ADDED', this, this.handleItemAdded);
      eventManager.subscribe(collection, 'E_ITEM_REMOVED', this, this.handleItemRemoved);
      this.collection = collection;
      this.items = items;
    }
    else {
      this.collection = new ArrayCollection();
      this.items = [];
    }
  }

  addItem(item, enabled = true, index = -1) {
    // virtual method called during item add !
  }

  getFocusedItem() {
    return this.items[this.getFocusedItemWidgetIndex()];
  }

  getSelectedItem() {
    return this.items[this.getSelectedItemWidgetIndex()];
  }

  setSortPredicate(sortPredicate) {
    if (this.collection) {
      this.clear();
      this.items = this.collection.sort(sortPredicate).filter(this.filterPredicate);
      this.items.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.sortPredicate = sortPredicate;
  }

  setFilterPredicate(filterPredicate) {
    if (this.collection) {
      this.clear();
      this.items = this.collection.sort(this.sortPredicate).filter(filterPredicate);
      this.items.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.filterPredicate = filterPredicate;
  }

  setEnablePredicate(enablePredicate) {
    if (this.collection) {
      this.clear();
      this.items = this.collection.sort(this.sortPredicate).filter(this.filterPredicate);
      this.items.forEach(item => this.addItem(item, enablePredicate(item)));
    }

    this.enablePredicate = enablePredicate;
  }

  handleItemAdded(data) {
    this.items = this.collection.sort(this.sortPredicate).filter(this.filterPredicate);
    let index = this.items.indexOf(data.item);
    this.addItem(data.item, this.enablePredicate(data.item), index);
  }

  handleItemRemoved(data) {
    let index = this.items.indexOf(data.item);
    this.items = this.collection.sort(this.sortPredicate).filter(this.filterPredicate);
    this.removeItem(index);
  }
}

module.exports.UIListViewWidget = UIListViewWidget;