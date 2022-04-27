let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

class UIInputSlider extends UIWidget {
  constructor() {
    super({
      className: 'UIInputSlider',
      template: `
      <input class="UIInputSlider-range" type="range" min="0" max="0" step="1" value="0">
      <div class="UIInputSlider-value">0</div>`
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

    this.node.querySelector('.UIInputSlider-range').value = value;
    this.node.querySelector('.UIInputSlider-value').textContent = value;
    this.value = value;    
  }

  setMin(min) {
    this.node.querySelector('.UIInputSlider-range').min = min;
    this.min = min;
  }

  setMax(max) {
    this.node.querySelector('.UIInputSlider-range').max = max;
    this.max = max;
  }

  setStep(step) {
    this.node.querySelector('.UIInputSlider-range').step = step;
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

    this.node.querySelector('.UIInputSlider-range').value = this.value;
    this.node.querySelector('.UIInputSlider-value').textContent = this.value;
  }
}

module.exports.UIInputSlider = UIInputSlider;