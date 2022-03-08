class Screen {
  constructor(app) {
    this.app = app;
    this.blocking = true;
  }

  setBlocking(blocking) {
    this.blocking = blocking;
  }

  onEnter(args) {
    // virtual method called during enter phase !
  }

  onExit() {
    // virtual method called during exit phase !
  }

  onBringToFront() {
    // virtual method called when get the top state level !
  }

  onBringToBack() {
    // virtual method called when lost the top state level !
  }

  onEvent(event) {
    // virtual method called during event pulling phase !
  }

  onUpdate(ts) {
    // virtual method called during update phase !
  }

  onDraw(viewIndex) {
    // virtual method called during draw phase !
  }
}

module.exports.Screen = Screen;