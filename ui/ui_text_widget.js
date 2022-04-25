let { UIWidget } = require('./ui_widget');

class UITextWidget extends UIWidget {
  constructor() {
    super({
      className: 'UITextWidget',
      template: '<span class="UITextWidget-text"></span>'
    });
  }

  setText(text) {
    this.node.querySelector('.UITextWidget-text').textContent = text;
  }
}

module.exports.UITextWidget = UITextWidget;