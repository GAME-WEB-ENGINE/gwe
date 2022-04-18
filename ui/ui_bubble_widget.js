let { eventManager } = require('../event/event_manager');
let { InputKeyEnum } = require('../input/input_enums');
let { UIWidget } = require('./ui_widget');
let { UIMenuWidget } = require('./ui_menu_widget');

class UIBubbleWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIBubbleWidget',
      template: `
      <div class="UIBubbleWidget-text"></div>
      <div class="UIBubbleWidget-menu"></div>`
    });

    this.text = '';
    this.actions = [];
    this.stepDuration = 0;
    this.currentTextOffset = 0;
    this.currentActionTextOffset = 0;
    this.currentActionIndex = 0;
    this.timeElapsed = 0;
    this.isFinished = false;

    this.menuWidget = new UIMenuWidget();
    this.node.querySelector('.UIBubbleWidget-menu').replaceWith(this.menuWidget.node);
    eventManager.subscribe(this.menuWidget, 'E_MENU_ITEM_SELECTED', this, this.handleMenuItemSelected);
  }

  update(ts) {
    this.menuWidget.update(ts);

    if (!this.isFinished && this.currentTextOffset == this.text.length && this.currentActionIndex == this.actions.length) {
      this.isFinished = true;
      eventManager.emit(this, 'E_PRINT_FINISHED');
      return;
    }

    if (this.timeElapsed >= this.stepDuration) {
      if (this.currentTextOffset < this.text.length) {
        this.node.querySelector('.UIBubbleWidget-text').textContent = this.text.substring(0, this.currentTextOffset + 1);
        this.currentTextOffset++;
      }
      else if (this.currentActionIndex < this.actions.length) {
        if (this.currentActionTextOffset == 0) {
          this.menuWidget.addItemWidget(new UIMenuTextWidget({ text: '' }));
        }
        else if (this.currentActionTextOffset < this.actions[this.currentActionIndex].length) {
          this.menuWidget.itemWidgets[this.currentActionIndex].setText(this.actions[this.currentActionIndex].substring(0, this.currentActionTextOffset + 1));
          this.currentActionTextOffset++;
        }
        else {
          this.currentActionIndex++;
          this.currentActionTextOffset = 0;
        }
      }

      this.timeElapsed = 0;
    }
    else {
      this.timeElapsed += ts;
    }
  }

  delete() {
    this.menuWidget.delete();
    super.delete();
  }

  focus() {
    this.menuWidget.focus();
    super.focus();
  }

  unfocus() {
    this.menuWidget.unfocus();
    super.unfocus();
  }

  setWidth(width) {
    this.node.style.width = width + 'px';
  }

  setText(text) {
    this.text = text;
    this.currentTextOffset = 0;
    this.isFinished = false;
  }

  setActions(actions) {
    this.actions = actions;
    this.currentActionIndex = 0;
    this.currentActionTextOffset = 0;
    this.isFinished = false;
    this.menuWidget.clear();
  }

  setStepDuration(stepDuration) {
    this.stepDuration = stepDuration;
  }

  handleMenuItemSelected(data) {
    eventManager.emit(this, 'E_MENU_ITEM_SELECTED', data);
  }

  onKeyDownOnce(data) {
    if (data.key == InputKeyEnum.ENTER && this.isFinished) {
      eventManager.emit(this, 'E_CLOSE');
    }
  }
}

module.exports.UIBubbleWidget = UIBubbleWidget;