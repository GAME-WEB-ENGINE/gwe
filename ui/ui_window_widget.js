let { uiManager } = require('./ui_manager');
let { UIWidget } = require('./ui_widget');

class UIWindowWidget extends UIWidget {
  constructor(options = {}) {
    super(options);
  }

  delete() {
    this.hide();
    super.delete();
  }

  setWidth(width) {
    this.node.style.width = width + 'px';
  }

  setPosition(x = 0, y = 0) {
    this.node.style.left = x + 'px';
    this.node.style.top = y + 'px';
  }

  show() {
    uiManager.enableOverlayer(true);
    this.node.classList.add('Window--show');
  }

  hide() {
    uiManager.enableOverlayer(false);
    this.node.classList.remove('Window--show');
  }

  isShow() {
    return this.node.classList.contains('Window--show');
  }
}

module.exports.UIWindowWidget = UIWindowWidget;