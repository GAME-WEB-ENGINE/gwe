let { inputManager } = require('../input/input_manager');
let { eventManager } = require('../event/event_manager');

class UIWidget {
  constructor(options = {}) {
    this.id = '';
    this.focused = false;
    this.className = options.className || '';
    this.template = options.template || '';
    this.node = document.createElement('div');
    this.node.className = this.className;
    this.node.innerHTML = this.template;
  }

  update() {
    // virtual method called during update phase !
  }

  delete() {
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN', this);
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN_ONCE', this);
    this.node.remove();
    this.node = null;
  }

  setId(id) {
    this.id = id;
  }

  focus() {
    eventManager.subscribe(inputManager, 'E_KEYDOWN', this, false, this.onKeyDown);
    eventManager.subscribe(inputManager, 'E_KEYDOWN_ONCE', this, false, this.onKeyDownOnce);
    this.node.classList.add('focused');
    this.focused = true;
    eventManager.emit(this, 'E_FOCUSED');
  }

  unfocus() {
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN', this);
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN_ONCE', this);
    this.node.classList.remove('focused');
    this.focused = false;
    eventManager.emit(this, 'E_UNFOCUSED');
  }

  show() {
    this.node.classList.remove('u-hidden');
  }

  hide() {
    this.node.classList.add('u-hidden');
  }

  isShow() {
    return this.node.classList.contains('u-hidden') == false;
  }

  onKeyDown(data) {
    // virtual method called during keydown event !
  }

  onKeyDownOnce(data) {
    // virtual method called during keydown once event !
  }
}

module.exports.UIWidget = UIWidget;