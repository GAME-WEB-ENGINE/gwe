let { UIWidget } = require('./ui_widget');

class UIMenuText extends UIWidget {
  constructor(options = {}) {
    super({
      className: 'UIMenuText'
    });

    this.node.textContent = options.text;
  }

  setText(text) {
    this.node.textContent = text;
  }
}

module.exports.UIMenuText = UIMenuText;