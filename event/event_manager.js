let { EventSubscriber } = require('./event_subscriber');

/**
 * Singleton représentant une gestionnaire d'évènements.
 */
class EventManager {
  /**
   * Créer un gestionnaire d'évènements.
   */
  constructor() {
    this.subscribers = [];
  }

  /**
   * Attend l'arrivé d'un évènement.
   * @param {object} emitter - L'objet émetteur.
   * @param {string} type - Le type d'évènement.
   * @return {Promise} Promesse.
   */
  wait(emitter, type) {
    return new Promise(resolve => {
      this.subscribeOnce(emitter, type, this, (data) => {
        resolve(data);
      });
    });
  }

  /**
   * Inscription à un évènement.
   * @param {object} emitter - L'objet émetteur.
   * @param {string} type - Le type d'évènement.
   * @param {object} listener - L'objet écouteur.
   * @param {function} cb - La fonction à appeler
   */
  subscribe(emitter, type, listener, cb) {
    if (!emitter) {
      throw new Error('EventManager::subscribe(): emitter is undefined !');
    }
    if (!type) {
      throw new Error('EventManager::subscribe(): type is undefined !');
    }
    if (!cb || typeof cb != 'function') {
      throw new Error('EventManager::subscribe(): cb is not a function !');
    }

    this.subscribers.push(new EventSubscriber(emitter, type, listener, false, cb));
  }

  /**
   * Inscription à un évènement.
   * Attention cependant, l'inscription est supprimer après le premier appel.
   * @param {object} emitter - L'objet émetteur.
   * @param {string} type - Le type d'évènement.
   * @param {object} listener - L'objet écouteur.
   * @param {function} cb - La fonction à appeler
   */
  subscribeOnce(emitter, type, listener, cb) {
    if (!emitter) {
      throw new Error('EventManager::subscribe(): emitter is undefined !');
    }
    if (!type) {
      throw new Error('EventManager::subscribe(): type is undefined !');
    }
    if (!cb || typeof cb != 'function') {
      throw new Error('EventManager::subscribe(): cb is not a function !');
    }

    this.subscribers.push(new EventSubscriber(emitter, type, listener, true, cb));
  }

  /**
   * Desinscription à un évènement.
   * @param {object} emitter - L'objet émetteur.
   * @param {string} type - Le type d'évènement.
   * @param {object} listener - L'objet écouteur.
   */
  unsubscribe(emitter, type, listener) {
    for (let subscriber of this.subscribers) {
      if (subscriber.emitter == emitter && subscriber.type == type && subscriber.listener == listener) {
        this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
        return;
      }
    }
  }

  /**
   * Desinscription de tous les évènements.
   */
  unsubscribeAll() {
    this.subscribers = [];
  }

  /**
   * Emet un évènement.
   * @param {object} emitter - L'objet émetteur.
   * @param {string} type - Le type d'évènement.
   * @param {object} data - Données transitoires.
   * @return {Promise} Promesse resolue lorsque tous les écouteurs ont terminés.
   */
  async emit(emitter, type, data) {
    let promises = [];

    for (let subscriber of this.subscribers.slice()) {
      if (subscriber.emitter == emitter && subscriber.type == type) {
        let res = subscriber.cb.call(subscriber.listener, data);
        if (res instanceof Promise) {
          promises.push(res);
        }
  
        if (subscriber.once) {
          this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
        }
      }
    }

    return Promise.all(promises);
  }
}

module.exports.eventManager = new EventManager();