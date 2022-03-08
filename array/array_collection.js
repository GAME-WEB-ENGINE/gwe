let { eventManager } = require('../event/event_manager');

class ArrayCollection extends Array {
  constructor(length = 0) {
    super(length);
  }

  push(item, emit = false) {
    super.push(item);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_ADDED', { item: item, index: super.indexOf(item) });
    }
  }

  pop(emit = false) {
    let item = super.pop();
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: super.length });
    }

    return item;
  }

  remove(item, emit = false) {
    let index = super.indexOf(item);
    super.splice(index, 1);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: index });
    }
  }

  removeIf(predicate, emit = false) {
    for (let item of this) {
      if (predicate(item)) {
        this.remove(item, emit);
      }
    }
  }

  removeFirstIf(predicate, emit = false) {
    for (let item of this) {
      if (predicate(item)) {
        return this.remove(item, emit);
      }
    }
  }

  removeAt(index, emit = false) {
    super.splice(index, 1);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { index: index });
    }
  }

  has(item) {
    return this.indexOf(item) != -1;
  }

  contains(items) {
    for (let item of items) {
      if (this.indexOf(item) == -1) {
        return false;
      }
    }

    return true;
  }

  clear(emit = false) {
    while (this.length) {
      this.pop(emit);
    }
  }
}

module.exports.ArrayCollection = ArrayCollection;