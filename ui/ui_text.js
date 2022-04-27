let { UIWidget } = require('./ui_widget');

class UIText extends UIWidget {
  constructor() {
    super({
      className: 'UIText',
      template: '<span class="UIText-text"></span>'
    });
  }

  setText(text) {
    this.node.querySelector('.UIText-text').textContent = text;
  }
}

module.exports.UIText = UIText;