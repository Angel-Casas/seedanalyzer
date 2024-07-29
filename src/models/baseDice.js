'use strict';

export default class BaseDice {
  constructor(proxy) {
    this.proxy = proxy;
  }
  async resetSeed(req) {
    return true;
  }

  async donate(req) {
    let errs = new Error('Platform does not support Donate');
    errs.value = 'Platfor does not support Donate';
    return true;
  }
}