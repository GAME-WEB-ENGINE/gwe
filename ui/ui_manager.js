let { eventManager} = require('../event/event_manager');

class UIManager {
  constructor() {
    this.root = null;
    this.fadeLayer = null;
    this.overLayer = null;
    this.focusedWidget = null;
    this.widgets = [];

    this.root = document.getElementById('UI_ROOT');
    if (!this.root) {
      throw new Error('UIManager::UIManager: UI_ROOT element not found !');
    }

    this.fadeLayer = document.getElementById('UI_FADELAYER');
    if (!this.fadeLayer) {
      throw new Error('UIManager::UIManager: UI_FADELAYER element not found !');
    }

    this.overLayer = document.getElementById('UI_OVERLAYER');
    if (!this.overLayer) {
      throw new Error('UIManager::UIManager: UI_OVERLAYER element not found !');
    }
  }

  update() {
    for (let widget of this.widgets) {
      widget.update();
    }
  }

  focus(widget) {
    if (this.focusedWidget) {
      this.focusedWidget.unfocus();
    }

    widget.focus();
    this.focusedWidget = widget;
    eventManager.emit(this, 'E_FOCUSED', { widget: widget });
  }

  unfocus() {
    if (!this.focusedWidget) {
      return;
    }

    this.focusedWidget.unfocus();
    this.focusedWidget = null;
    eventManager.emit(this, 'E_UNFOCUSED');
  }

  addNode(node, styles = '') {
    node.style.cssText += styles;
    this.root.appendChild(node);
  }

  removeNode(node) {
    this.root.removeChild(node);
  }

  addWidget(widget, styles = '') {
    widget.node.style.cssText += styles;
    this.root.appendChild(widget.node);
    this.widgets.push(widget);
    return widget;
  }

  removeWidget(widget) {
    let index = this.widgets.indexOf(widget);
    if (index == -1) {
      throw new Error('UIManager::removeWidget: fail to remove widget !');
    }

    if (this.widgets[index] == this.focusedWidget) {
      this.unfocus();
    }

    this.widgets[index].delete();
    this.widgets.splice(index, 1);
    return true;
  }

  removeWidgetIf(cb) {
    for (let widget of this.widgets) {
      if (cb && cb(widget)) {
        this.removeWidget(widget);
      }
    }
  }

  clear() {
    this.root.innerHTML = '';
    this.focusedWidget = null;

    while (this.widgets.length > 0) {
      let widget = this.widgets.pop();
      widget.delete();
    }
  }

  enableOverlayer(enable) {
    this.overLayer.style.opacity = (enable) ? '1' : '0';
  }

  fadeIn(delay, ms, transitionTimingFunction = 'linear', cb = () => {}) {
    this.fadeLayer.style.transitionDuration = ms + 'ms';
    this.fadeLayer.style.transitionDelay = delay + 'ms';
    this.fadeLayer.style.transitionTimingFunction = transitionTimingFunction;
    this.fadeLayer.style.opacity = 1;
    setTimeout(() => { cb(); }, delay + ms);
  }

  fadeOut(delay, ms, transitionTimingFunction = 'linear', cb = () => {}) {
    this.fadeLayer.style.transitionDuration = ms + 'ms';
    this.fadeLayer.style.transitionDelay = delay + 'ms';
    this.fadeLayer.style.transitionTimingFunction = transitionTimingFunction;
    this.fadeLayer.style.opacity = 0;
    setTimeout(() => { cb(); }, delay + ms);
  }
}

module.exports.uiManager = new UIManager();