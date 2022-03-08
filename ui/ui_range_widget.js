let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');

class UIRangeWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIRangeWidget',
      template: `
      <div class="UIRangeWidget-prevIcon"><</div>
      <div class="UIRangeWidget-value">0</div>
      <div class="UIRangeWidget-nextIcon">></div>`
    });

    this.value = 0;
    this.min = 0;
    this.max = 0;
    this.step = 1;
  }

  setValue(value) {
    if (value == this.value) {
      return;
    }

    this.node.querySelector('.UIRangeWidget-value').textContent = value;
    this.value = value;
  }

  setMin(min) {
    this.min = min;
  }

  setMax(max) {
    this.max = max;
  }

  setStep(step) {
    this.step = step;
  }

  onKeyDown(data) {
    if (data.key == KEY_LEFT && this.value - this.step >= this.min) {
      this.value -= this.step;
      eventManager.emit(this, 'E_VALUE_CHANGED', { value: this.value });
    }
    else if (data.key == KEY_RIGHT && this.value + this.step <= this.max) {
      this.value += this.step;
      eventManager.emit(this, 'E_VALUE_CHANGED', { value: this.value });
    }

    this.node.querySelector('.UIRangeWidget-value').textContent = this.value;
  }
}

module.exports.UIRangeWidget = UIRangeWidget;