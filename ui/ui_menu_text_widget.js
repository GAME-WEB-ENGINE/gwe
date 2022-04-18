let { UIWidget } = require('./ui_widget');

class UIMenuTextWidget extends UIWidget {
  constructor(options = {}) {
    super({
      className: 'UIMenuTextWidget'
    });

    this.node.textContent = options.text;
  }

  setText(text) {
    this.node.textContent = text;
  }
}

module.exports.UIMenuTextWidget = UIMenuTextWidget;