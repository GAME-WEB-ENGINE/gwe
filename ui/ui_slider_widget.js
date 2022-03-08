let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');

class UISliderWidget extends UIWidget {
  constructor() {
    super({
      className: 'UISliderWidget',
      template: `
      <input class="UISliderWidget-range" type="range" min="0" max="0" step="1" value="0">
      <div class="UISliderWidget-value">0</div>`
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

    this.node.querySelector('.UISliderWidget-range').value = value;
    this.node.querySelector('.UISliderWidget-value').textContent = value;
    this.value = value;    
  }

  setMin(min) {
    this.node.querySelector('.UISliderWidget-range').min = min;
    this.min = min;
  }

  setMax(max) {
    this.node.querySelector('.UISliderWidget-range').max = max;
    this.max = max;
  }

  setStep(step) {
    this.node.querySelector('.UISliderWidget-range').step = step;
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

    this.node.querySelector('.UISliderWidget-range').value = this.value;
    this.node.querySelector('.UISliderWidget-value').textContent = this.value;
  }
}

module.exports.UISliderWidget = UISliderWidget;