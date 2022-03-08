let { UIWidget } = require('./ui_widget');

class UIDescListWidget extends UIWidget {
  constructor(options = {}) {
    super(options);
  }

  addItem(label, value) {
    let tpl = document.createElement('template');
    tpl.innerHTML = `
      <span class="${this.className}-item">
        <span class="${this.className}-item-label">${label}</span>
        <span class="${this.className}-item-value">${value}</span>
      </span>`;

    this.node.appendChild(tpl.content);
  }

  removeItem(index) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIDescListWidget::removeItem(): item not found !');
    }

    this.node.removeChild(item);
  }

  setItem(index, value) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIDescListWidget::setItem(): item not found !');
    }

    item.querySelector(`.${this.className}-item-value`).textContent = value;
  }

  setItemVisible(index, visible) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIDescListWidget::setItemVisible(): item not found !');
    }

    item.style.display = (visible) ? 'block' : 'none';
  }

  getItemVisible(index) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIDescListWidget::getItemVisible(): item not found !');
    }

    return item.style.display == 'block';
  }

  getItemValue(index) {
    let item = this.node.children[index];
    if (!item) {
      throw new Error('UIDescListWidget::getItemValue(): item not found !');
    }

    return item.querySelector(`.${this.className}-item-value`).textContent;
  }

  clear() {
    this.node.innerHTML = '';
  }
}

module.exports.UIDescListWidget = UIDescListWidget;