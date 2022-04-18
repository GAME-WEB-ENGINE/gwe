let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

class UIInputRangeWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIInputRangeWidget',
      template: `
      <div class="UIInputRangeWidget-prevIcon"><</div>
      <div class="UIInputRangeWidget-value">0</div>
      <div class="UIInputRangeWidget-nextIcon">></div>`
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

    this.node.querySelector('.UIInputRangeWidget-value').textContent = value;
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
    if (data.key == InputKeyEnum.LEFT && this.value - this.step >= this.min) {
      this.value -= this.step;
      eventManager.emit(this, 'E_VALUE_CHANGED', { value: this.value });
    }
    else if (data.key == InputKeyEnum.RIGHT && this.value + this.step <= this.max) {
      this.value += this.step;
      eventManager.emit(this, 'E_VALUE_CHANGED', { value: this.value });
    }

    this.node.querySelector('.UIInputRangeWidget-value').textContent = this.value;
  }
}

module.exports.UIInputRangeWidget = UIInputRangeWidget;