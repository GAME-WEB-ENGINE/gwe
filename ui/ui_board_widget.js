let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');
let { UIMenuWidget, MenuAxisEnum } = require('./ui_menu_widget');

class UIBoardWidget extends UIWidget {
  constructor() {
    super({
      className: 'UIBoardWidget',
      template: `
      <div class="UIBoardWidget-value"></div>
      <div class="UIBoardWidget-keyboard">
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu00"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu01"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu02"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu03"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu04"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu05"></div>
        <div class="UIBoardWidget-keyboard-menu UIBoardWidget-keyboard-menu06"></div>
      </div>
      <div class="UIBoardWidget-actions">
        <div class="UIBoardWidget-actions-menu UIBoardWidget-keyboard-menu07"></div>
      </div>`
    });

    this.value = '';
    this.menus = new Collection();
    this.menuIndex = 0;
    this.keyColumn = 0;

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="A">A</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="B">B</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="C">C</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="D">D</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="E">E</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="F">F</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="G">G</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="H">H</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="I">I</button>`);
    this.menus[0].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="J">J</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu00').replaceWith(this.menus[0].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="K">K</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="L">L</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="M">M</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="N">N</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="O">O</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="P">P</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="Q">Q</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="R">R</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="S">S</button>`);
    this.menus[1].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="T">T</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu01').replaceWith(this.menus[1].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="U">U</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="V">V</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="W">W</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="X">X</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="Y">Y</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="Z">Z</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="!">!</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="?">?</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="$">$</button>`);
    this.menus[2].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="#">#</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu02').replaceWith(this.menus[2].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="a">a</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="b">b</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="c">c</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="d">d</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="e">e</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="f">f</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="g">g</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="h">h</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="i">i</button>`);
    this.menus[3].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="j">j</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu03').replaceWith(this.menus[3].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="k">k</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="l">l</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="m">m</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="n">n</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="o">o</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="p">p</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="q">q</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="r">r</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="s">s</button>`);
    this.menus[4].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="t">t</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu04').replaceWith(this.menus[4].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="u">u</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="v">v</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="w">w</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="x">x</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="y">y</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="z">z</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="=">=</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="-">-</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="+">+</button>`);
    this.menus[5].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="%">%</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu05').replaceWith(this.menus[5].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-keyboard-menu', axis: MenuAxisEnum.X }));
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="0">0</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="1">1</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="2">2</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="3">3</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="4">4</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="5">5</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="6">6</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="7">7</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="8">8</button>`);
    this.menus[6].addItem(`<button class="UIBoardWidget-keyboard-menu-item" data-char="9">9</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu06').replaceWith(this.menus[6].node);

    this.menus.push(new UIMenuWidget({ className: 'UIBoardWidget-actions-menu', axis: MenuAxisEnum.X }));
    this.menus[7].addItem(`<button class="UIBoardWidget-actions-menu-item">Supprimer</button>`);
    this.menus[7].addItem(`<button class="UIBoardWidget-actions-menu-item">Valider</button>`);
    this.node.querySelector('.UIBoardWidget-keyboard-menu07').replaceWith(this.menus[7].node);
    this.menus[7].focusItem(0);

    eventManager.subscribe(this.menus[0], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[0], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[0], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[1], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[1], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[1], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[2], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[2], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[2], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[3], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[3], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[3], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[4], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[4], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[4], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[5], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[5], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[5], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[6], 'E_FOCUSED', this, this.handleKeyboardMenuFocused);
    eventManager.subscribe(this.menus[6], 'E_MENU_ITEM_SELECTED', this, this.handleKeyboardMenuItemSelected);
    eventManager.subscribe(this.menus[6], 'E_MENU_ITEM_FOCUSED', this, this.handleKeyboardMenuItemFocused);
    eventManager.subscribe(this.menus[7], 'E_MENU_ITEM_SELECTED', this, this.handleActionsMenuItemSelected);
  }

  update() {
    this.menus[0].update();
    this.menus[1].update();
    this.menus[2].update();
    this.menus[3].update();
    this.menus[4].update();
    this.menus[5].update();
    this.menus[6].update();
    this.menus[7].update();
  }

  delete() {
    this.menus[0].delete();
    this.menus[1].delete();
    this.menus[2].delete();
    this.menus[3].delete();
    this.menus[4].delete();
    this.menus[5].delete();
    this.menus[6].delete();
    this.menus[7].delete();
    super.delete();
  }

  focus() {
    this.menus[this.menuIndex].focus();
    super.focus();
  }

  unfocus() {
    this.menus[this.menuIndex].unfocus();
    super.unfocus();
  }

  setValue(value) {
    if (value == this.value) {
      return;
    }

    this.node.querySelector('.Input-value').textContent = value;
    this.value = value;
  }

  handleKeyboardMenuFocused() {
    this.menus[this.menuIndex].focusItem(this.keyColumn);
  }

  handleKeyboardMenuItemFocused(data) {
    this.keyColumn = data.index;
  }

  handleKeyboardMenuItemSelected(data) {
    this.menus[this.menuIndex].unselectItems();
    this.value += data.item.dataset.char;
    this.node.querySelector('.UIBoardWidget-value').textContent = this.value;
  }

  handleActionsMenuItemSelected(data) {
    if (data.index == 0) {
      this.value = this.value.substr(0, this.value.length - 1);
    }
    else if (data.index == 1) {
      eventManager.emit(this, 'E_VALIDATE', { value: this.value });
    }

    this.menus[this.menuIndex].unselectItems();
    this.node.querySelector('.UIBoardWidget-value').textContent = this.value;
  }

  onKeyDown(data) {
    if (data.key == KEY_UP) {
      this.menus[this.menuIndex].unfocus();
      this.menuIndex = (this.menuIndex - 1 < 0) ? this.menus.length - 1 : this.menuIndex - 1;
      this.menus[this.menuIndex].focus(MENU_NONEFOCUS);
    }
    else if (data.key == KEY_DOWN) {
      this.menus[this.menuIndex].unfocus();
      this.menuIndex = (this.menuIndex + 1 >= this.menus.length) ? 0 : this.menuIndex + 1;
      this.menus[this.menuIndex].focus(MENU_NONEFOCUS);
    }
  }
}

module.exports.UIBoardWidget = UIBoardWidget;