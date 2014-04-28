
exports = module.exports = (function() {
  "use strict";

  return function Trait(methods) {
    if (!(this instanceof Trait)) {
      return new Trait(methods);
    }

    if (typeof methods !== 'object') {
      throw new TypeError('`methods` must be type of Object.');
    }

    // valid each method

    for (var name in methods) {
      if (typeof methods[name] !== 'function') {
        throw new TypeError('All properties of a trait must be of type Function.');
      }
    }

    this.methods = methods;
  };
})();