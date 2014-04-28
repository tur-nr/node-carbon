exports = module.exports = (function() {
  "use strict";

  return function Interface(definitions) {
    var interf;

    if (!Array.isArray(definitions)) {
      throw new TypeError('`definitions` must be type of Array.');
    }

    interf = function() {};

    interf.implements = function(class_) {
      var proto;

      if (typeof class_ === 'function') {
        proto = class_.prototype;
      } else if (typeof class_ === 'object') {
        proto = class_;
      } else {
        return false;
      }

      return definitions.every(function(name) {
        return Boolean(proto[name]);
      });
    };

    return interf;
  };
})();