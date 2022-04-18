let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');

class UIDialogWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIDialogWidget',
      template: `
      <div class="UIDialogWidget-author"></div>
      <div class="UIDialogWidget-textbox">
        <div class="UIDialogWidget-textbox-text"></div>
        <div class="UIDialogWidget-textbox-next"></div>
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

    this.node.querySelector('.UIDialogWidget-textbox-next').style.display = 'none';

    if (!this.isFinished && this.currentTextOffset == this.text.length) {
      this.isFinished = true;
      this.node.querySelector('.UIDialogWidget-textbox-next').style.display = 'block';
      eventManager.emit(this, 'E_PRINT_FINISHED');
      return;
    }

    if (this.timeElapsed >= this.stepDuration) {
      if (this.currentTextOffset < this.text.length) {
        this.node.querySelector('.UIDialogWidget-textbox-text').textContent = this.text.substring(0, this.currentTextOffset + 1);
        this.currentTextOffset++;
      }

      this.timeElapsed = 0;
    }
    else {
      this.timeElapsed += ts;
    }
  }

  setAuthor(author) {
    this.node.querySelector('.UIDialogWidget-author').textContent = author;
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

module.exports.UIDialogWidget = UIDialogWidget;