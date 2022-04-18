let fs = require('fs');

class JSC {
  constructor() {
    this.blocks = [];
  }
}

class JSCBlock {
  constructor() {
    this.id = '';
    this.description = '';
    this.calls = [];
  }
}

class JSCBlockCall {
  constructor() {
    this.commandName = '';
    this.commandArgs = [];
  }
}

/**
 * Classe représentant une machine de script.
 * Cette classe crée un contexte d'exécution et permet de lancer un script (fichier JSC).
 * Note: Chaque script à sa propre machine d'exécution.
 */
class ScriptMachine {
  /**
   * Créer une machine de script.
   */
  constructor() {
    this.jsc = new JSC();
    this.commandRegister = new Map();
    this.enabled = true;
    this.currentBlockId = '';
    this.currentCallIndex = 0;
    this.onBeforeBlockExec = (block) => { };
    this.onAfterBlockExec = (block) => { };
    this.onBeforeCommandExec = (command) => { };
    this.onAfterCommandExec = (command) => { };
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    if (!this.enabled) {
      return;
    }

    let currentBlock = this.jsc.blocks.find(block => block.id == this.currentBlockId);
    if (!currentBlock) {
      return;
    }

    if (this.currentCallIndex == currentBlock.calls.length) {
      this.onAfterBlockExec(currentBlock);
      this.currentBlockId = '';
      this.currentCallIndex = 0;
      return;
    }

    if (this.currentCallIndex == 0) {
      this.onBeforeBlockExec(currentBlock);
    }

    let currentCall = currentBlock.calls[this.currentCallIndex];
    let jumpto = this.runCommand(currentCall.commandName, currentCall.commandArgs);
    if (jumpto) {
      this.currentBlockId = jumpto;
      this.currentCallIndex = 0;
      return;
    }

    if (this.currentCallIndex < currentBlock.calls.length) {
      this.currentCallIndex++;
    }
  }

  /**
   * Charge un fichier "jsc".
   * @param {string} path - Le chemin du fichier.
   */
  loadFromFile(path) {
    let json = JSON.parse(fs.readFileSync(path));
    this.jsc = new JSC();

    for (let objBlock of json) {
      let block = new JSCBlock();
      block.id = objBlock['Id'];
      block.description = objBlock['Description'];
      block.calls = [];
      for (let objCall of objBlock['Calls']) {
        let call = new JSCBlockCall();
        call.commandName = objCall['Name'];
        call.commandArgs = objCall['Args'];
        block.calls.push(call);
      }

      this.jsc.blocks.push(block);
    }
  }

  /**
   * Enregistre une nouvelle commande.
   * Note: L'identifiant d'une commande doit être unique.
   * @param {string} key - L'identifiant de la commande.
   * @param {function} commandFunc - La fonction de la commande.
   */
  registerCommand(key, commandFunc = () => { }) {
    if (this.commandRegister.has(key)) {
      throw new Error('ScriptMachine::registerCommand: key already exist !')
    }

    this.commandRegister.set(key, commandFunc);
  }

  /**
   * Exécute une commande.
   * @param {string} key - L'identifiant de la commande.
   * @param {array} args - Un tableau d'arguments passés à la fonction de la commande.
   * @return {string} Le retour de la commande.
   */
  runCommand(key, args = []) {
    let command = this.commandRegister.get(key);
    if (!command) {
      throw new Error('ScriptMachine::runCommand: try to call an not existant command ' + key + ' !');
    }

    this.onBeforeCommandExec(command);
    let jumpto = command.call(this, ...args);
    this.onAfterCommandExec(command);
    return jumpto;
  }

  /**
   * Vide le registre des commandes.
   */
  clearCommandRegister() {
    this.commandRegister = new Map();
  }

  /**
   * Vérifie si la machine de script est activée.
   * @return {boolean} Le drapeau d'activation.
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Définit d'activation.
   * @param {boolean} enabled - Le drapeau d'activation.
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Saute sur le block d'instructions ciblé.
   * @param {string} blockId - L'identifiant du block d'instructions.
   */
  jump(blockId) {
    this.currentBlockId = blockId;
    this.currentCallIndex = 0;
  }
}

module.exports.ScriptMachine = ScriptMachine;