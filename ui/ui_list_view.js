let { eventManager } = require('../event/event_manager');
let { ArrayCollection } = require('../array/array_collection');
let { UIMenu } = require('./ui_menu');

class UIListView extends UIMenu {
  constructor(options = {}) {
    super(options);
    this.collection = new ArrayCollection();
    this.views = [];
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
      let items = collection.getItems();
      let views = items.sort(this.sortPredicate).filter(this.filterPredicate);
      views.forEach(item => this.addItem(item, this.enablePredicate(item)));
      eventManager.subscribe(collection, 'E_ITEM_ADDED', this, this.handleItemAdded);
      eventManager.subscribe(collection, 'E_ITEM_REMOVED', this, this.handleItemRemoved);
      this.collection = collection;
      this.views = views;
    }
    else {
      this.collection = new ArrayCollection();
      this.views = [];
    }
  }

  addItem(item, enabled = true, index = -1) {
    // virtual method called during item add !
  }

  getFocusedItem() {
    return this.views[this.getFocusedWidgetIndex()];
  }

  getSelectedItem() {
    return this.views[this.getSelectedWidgetIndex()];
  }

  setSortPredicate(sortPredicate) {
    if (this.collection) {
      let items = this.collection.getItems();
      this.views = items.sort(sortPredicate).filter(this.filterPredicate);

      this.clear();
      this.views.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.sortPredicate = sortPredicate;
  }

  setFilterPredicate(filterPredicate) {
    if (this.collection) {
      let items = this.collection.getItems();
      this.views = items.sort(this.sortPredicate).filter(filterPredicate);

      this.clear();
      this.views.forEach(item => this.addItem(item, this.enablePredicate(item)));
    }

    this.filterPredicate = filterPredicate;
  }

  setEnablePredicate(enablePredicate) {
    if (this.collection) {
      let items = this.collection.getItems();
      this.views = items.sort(this.sortPredicate).filter(this.filterPredicate);

      this.clear();
      this.views.forEach(item => this.addItem(item, enablePredicate(item)));
    }

    this.enablePredicate = enablePredicate;
  }

  handleItemAdded(data) {
    let items = this.collection.getItems();
    this.views = items.sort(this.sortPredicate).filter(this.filterPredicate);

    let index = this.views.indexOf(data.item);
    this.addItem(data.item, this.enablePredicate(data.item), index);
  }

  handleItemRemoved(data) {
    let index = this.views.indexOf(data.item);
    this.removeWidget(index);

    let items = this.collection.getItems();
    this.views = items.sort(this.sortPredicate).filter(this.filterPredicate);    
  }
}

module.exports.UIListView = UIListView;