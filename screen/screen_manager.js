let { Screen } = require('./screen');

class ScreenManager {
  constructor() {
    this.requests = [];
    this.stack = [];
  }

  handleEvent(event) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].onEvent(event);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  update(ts) {
    while (this.requests.length > 0) {
      let request = this.requests.pop();
      request();
    }

    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].onUpdate(ts);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  draw(viewIndex) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].onDraw(viewIndex);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  requestPushScreen(newTopScreen, args = {}) {
    this.requests.push(() => {
      if (this.stack.indexOf(newTopScreen) != -1) {
        throw new Error('ScreenManager::requestPushScreen(): You try to push an existing screen to the stack !');
      }

      let topScreen = this.stack[this.stack.length - 1];
      topScreen.onBringToBack(newTopScreen);

      newTopScreen.onEnter(args);
      this.stack.push(newTopScreen);
    });
  }

  requestSetScreen(state, args = {}) {
    this.requests.push(() => {
      this.stack.forEach((state) => state.onExit());
      this.stack = [];
      state.onEnter(args);
      this.stack.push(state);
    });
  }

  requestPopScreen() {
    this.requests.push(() => {
      if (this.stack.length == 0) {
        throw new Error('ScreenManager::requestPopScreen: You try to pop an empty state stack !');
      }

      let topScreen = this.stack[this.stack.length - 1];
      topScreen.onExit();
      this.stack.pop();

      if (this.stack.length > 0) {
        let newTopScreen = this.stack[this.stack.length - 1];
        newTopScreen.onBringToFront(topScreen);
      }
    });
  }
}

module.exports.screenManager = new ScreenManager();