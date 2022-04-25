let { UIWidget } = require('./ui_widget');

class UITextViewWidget extends UIWidget {
  constructor() {
    super({
      className: 'UITextViewWidget',
      template: '<span class="UITextViewWidget-text"></span>'
    });
  }

  setText(text) {
    this.node.querySelector('.UITextViewWidget-text').textContent = text;
  }
}

module.exports.UITextViewWidget = UITextViewWidget;