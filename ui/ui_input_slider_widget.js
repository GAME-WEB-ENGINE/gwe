let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

class UIInputSliderWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIInputSliderWidget',
      template: `
      <input class="UIInputSliderWidget-range" type="range" min="0" max="0" step="1" value="0">
      <div class="UIInputSliderWidget-value">0</div>`
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

    this.node.querySelector('.UIInputSliderWidget-range').value = value;
    this.node.querySelector('.UIInputSliderWidget-value').textContent = value;
    this.value = value;    
  }

  setMin(min) {
    this.node.querySelector('.UIInputSliderWidget-range').min = min;
    this.min = min;
  }

  setMax(max) {
    this.node.querySelector('.UIInputSliderWidget-range').max = max;
    this.max = max;
  }

  setStep(step) {
    this.node.querySelector('.UIInputSliderWidget-range').step = step;
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

    this.node.querySelector('.UIInputSliderWidget-range').value = this.value;
    this.node.querySelector('.UIInputSliderWidget-value').textContent = this.value;
  }
}

module.exports.UIInputSliderWidget = UIInputSliderWidget;