let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

let MenuFocusEnum = {
  AUTO: 0,
  NONE: 1
};

let MenuAxisEnum = {
  X: 0,
  Y: 1,
  XY: 2
};

class UIMenu extends UIWidget {
  constructor(options = {}) {
    super({
      className: options.className || 'UIMenu'
    });

    this.axis = options.axis != undefined ? options.axis : MenuAxisEnum.Y;
    this.rows = options.rows != undefined ? options.rows : 0;
    this.columns = options.columns != undefined ? options.columns : 0;
    this.multiple = options.multiple != undefined ? options.multiple : false;
    this.selectable = options.selectable != undefined ? options.selectable : true;
    this.widgets = [];
    this.focusedWidget = null;

    if (this.axis == MenuAxisEnum.X) {
      this.rows = 1;
      this.columns = Infinity;
      this.node.style.display = 'flex';
      this.node.style.flexDirection = 'row';
    }
    else if (this.axis == MenuAxisEnum.Y) {
      this.rows = Infinity;
      this.columns = 1;
      this.node.style.display = 'flex';
      this.node.style.flexDirection = 'column';
    }
    else {
      this.node.style.display = 'grid';
      this.node.style.grid = 'repeat(' + this.rows + ', auto) / repeat(' + this.columns + ', auto)';
    }
  }

  update(ts) {
    for (let widget of this.widgets) {
      widget.update(ts);
    }
  }

  focus(focusIndex = MenuFocusEnum.AUTO) {
    if (focusIndex == MenuFocusEnum.AUTO && !this.focusedWidget) {
      this.focusWidget(0);
    }
    else if (focusIndex == MenuFocusEnum.AUTO && this.focusedWidget) {
      this.focusWidget(this.getFocusedWidgetIndex());
    }
    else if (focusIndex >= 0) {
      this.focusWidget(focusIndex);
    }

    super.focus();
  }

  getFocusedWidgetIndex() {
    return this.widgets.indexOf(this.focusedWidget);
  }

  getSelectedWidgetIndex() {
    return this.widgets.findIndex(widget => widget.isSelected());
  }

  getSelectedWidgetIndexes() {
    return this.widgets.map(widget => widget.isSelected());
  }

  getWidgets() {
    return this.widgets;
  }

  addWidget(widget, enabled = true, index = -1) {
    if (index == -1) {
      this.widgets.push(widget);
      this.node.appendChild(widget.node);
    }
    else {
      this.widgets.splice(index + 1, 0, widget);
      this.node.insertBefore(widget.node, this.node.children[index]);
    }

    widget.setEnabled(enabled);
  }

  removeWidget(index) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::removeWidget(): widget not found !');
    }

    if (this.focusedWidget == widget) {
      this.focusedWidget = null;
    }

    this.widgets.splice(this.widgets.indexOf(widget), 1);
    widget.delete();
  }

  focusWidget(index, preventScroll = false, emit = true) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::focusWidget(): widget not found !');
    }

    if (!preventScroll) {
      let rect = this.getViewRectWidget(index);
      if (rect.top < 0) {
        this.node.scrollTop += rect.top;
      }
      if (rect.bottom > this.node.clientHeight) {
        this.node.scrollTop += rect.bottom - this.node.clientHeight;
      }
    }

    if (this.focusedWidget) {
      this.focusedWidget.unfocus();
    }
    
    widget.focus();
    this.focusedWidget = widget;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_FOCUSED', { widget: widget, index: index });
    }
  }

  unfocusWidget(emit = true) {
    if (!this.focusedWidget) {
      return;
    }

    this.focusedWidget.unfocus();
    this.focusedWidget = null;

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNFOCUSED');
    }
  }

  selectWidget(index, emit = true) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::selectWidget(): widget not found !');
    }
    if (!widget.isEnabled()) {
      return;
    }

    if (this.multiple && widget.isSelected()) {
      widget.setSelected(false);
      return;
    }

    if (!this.multiple) {
      this.widgets.forEach(widget => widget.setSelected(false));
    }

    widget.setSelected(true);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_SELECTED', { widget: widget, index: index });
    }
  }

  unselectWidget(index, emit = true) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::unselectWidget(): widget not found !');
    }
    if (!widget.isSelected()) {
      return;
    }

    widget.setSelected(false);

    if (emit) {
      eventManager.emit(this, 'E_MENU_ITEM_UNSELECTED', { widget: widget, index: index });
    }
  }

  unselectWidgets(emit = true) {
    this.widgets.forEach(widget => widget.setSelected(false));
    
    if (emit) {
      eventManager.emit(this, 'E_MENU_UNSELECTED');
    }
  }

  setWidgetEnabled(index, enabled = true, emit = true) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::setWidgetEnabled(): widget not found !');
    }

    widget.setEnabled(enabled);

    if (emit) {
      eventManager.emit(this, enabled ? 'E_MENU_ITEM_ENABLED' : 'E_MENU_ITEM_DISABLED', { widget: widget, index: index });
    }
  }

  isWidgetEnabled(index) {
    let widget = this.widgets[index];
    if (!widget) {
      throw new Error('UIMenu::setWidgetEnabled(): widget not found !');
    }

    return widget.isEnabled();
  }

  clear() {
    this.widgets.forEach(widget => widget.delete());
    this.widgets = [];
    this.focusedWidget = null;
    this.node.innerHTML = '';
  }

  close() {
    this.unselectWidgets();
    this.unfocusWidget();
    this.hide();
  }

  getViewRectWidget(index) {
    let top = this.node.children[index].offsetTop - this.node.scrollTop;
    let bottom = top + this.node.children[index].offsetHeight;
    return { top, bottom };
  }

  onKeyDownOnce(data) {
    let focusedIndex = this.getFocusedWidgetIndex();
    if (data.key == InputKeyEnum.CANCEL) {
      eventManager.emit(this, 'E_CLOSED');
    }
    if (data.key == InputKeyEnum.ENTER) {
      eventManager.emit(this, 'E_ENTER_PRESSED');
    }
    if (data.key == InputKeyEnum.ENTER && this.selectable && focusedIndex != -1) {
      this.selectWidget(focusedIndex);
    }

    if (data.key == InputKeyEnum.LEFT) {
      let prevIndex = (focusedIndex - 1 < 0) ? this.widgets.length - 1 : focusedIndex - 1;
      this.focusWidget(prevIndex);
    }
    else if (data.key == InputKeyEnum.RIGHT) {
      let nextIndex = (focusedIndex + 1 > this.widgets.length - 1) ? 0 : focusedIndex + 1;
      this.focusWidget(nextIndex);
    }
    else if (data.key == InputKeyEnum.UP) {
      let prevIndex = (focusedIndex - this.columns < 0) ? this.widgets.length - 1 : focusedIndex - this.columns;
      this.focusWidget(prevIndex);
    }
    else if (data.key == InputKeyEnum.DOWN) {
      let nextIndex = (focusedIndex + this.columns > this.widgets.length - 1) ? 0 : focusedIndex + this.columns;
      this.focusWidget(nextIndex);
    }
  }
}

module.exports.MenuFocusEnum = MenuFocusEnum;
module.exports.MenuAxisEnum = MenuAxisEnum;
module.exports.UIMenu = UIMenu;