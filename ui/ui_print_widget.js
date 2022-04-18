let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

class UIPrintWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIPrintWidget',
      template: `
      <div class="UIPrintWidget-textbox">
        <div class="UIPrintWidget-textbox-text"></div>
        <div class="UIPrintWidget-textbox-next"></div>
      </div>`
    });

    this.text = '';
    this.stepDuration = 0;
    this.currentTextOffset = 0;
    this.timeElapsed = 0;
    this.isFinished = false;
  }

  update(ts) {
    if (this.isFinished) {
      return;
    }

    this.node.querySelector('.UIPrintWidget-textbox-next').style.display = 'none';

    if (!this.isFinished && this.currentTextOffset == this.text.length) {
      this.isFinished = true;
      this.node.querySelector('.UIPrintWidget-textbox-next').style.display = 'block';
      eventManager.emit(this, 'E_PRINT_FINISHED');
      return;
    }

    if (this.timeElapsed >= this.stepDuration) {
      if (this.currentTextOffset < this.text.length) {
        this.node.querySelector('.UIPrintWidget-textbox-text').textContent = this.text.substring(0, this.currentTextOffset + 1);
        this.currentTextOffset++;
      }

      this.timeElapsed = 0;
    }
    else {
      this.timeElapsed += ts;
    }
  }

  setText(text) {
    this.text = text;
    this.currentTextOffset = 0;
    this.isFinished = false;
  }

  setStepDuration(stepDuration) {
    this.stepDuration = stepDuration;
  }

  onKeyDownOnce(data) {
    if (data.key == InputKeyEnum.ENTER && this.isFinished) {
      eventManager.emit(this, 'E_CLOSE');
    }
  }
}

module.exports.UIPrintWidget = UIPrintWidget;