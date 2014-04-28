var util = require('util')
  , Trait = require('./trait');

/**
 * Class
 * 
 * @see Class
 * @return {Function}
 */
exports = module.exports = (function() {
  "use strict";

  /**
   * Applies inheritance from one Class to another.
   *
   * @private
   * @param  {Function} base   The base Class that will inherit.
   * @param  {Function} super_ The parent Class that will be extended.
   * @param  {Object}   proto  The prototype that will be applied to the base
   *                           Class.
   * @return {Function} The extended Class constructor.
   */
  function inherit(base, super_, proto) {
    var constructor = function() {
      var argv = Array.prototype.slice.call(arguments)
        , methods;

      // reference the parent Class
      this.parent_ = {
        constructor: super_.bind(this)
      };

      base.apply(this, argv);

      // copy the parent's prototype
      for (var name in super_.prototype) {
        if (typeof proto[name] === 'function') {
          this.parent_[name] = super_.prototype[name].bind(this);
        }
      }
    };

    util.inherits(constructor, super_);

    return constructor;
  }

  /**
   * Mixes trait methods onto a given prototype object.
   *
   * @private
   * @param  {Object} proto The prototype to mix methods into.
   * @param  {Trait}  trait Traits to mix.
   * @return {undefined}
   */
  function mix(proto, trait) {
    for (var name in trait.methods) {
      if (!proto[name]) { // traits can not overwrite
        proto[name] = trait.methods[name];
      }
    }
  }

  /**
   * Class
   * 
   * A Class is a factory method that creates Class-like constructors and applies
   * a prototypal inheritance.
   *
   * @see Traits
   * @see Interface
   * 
   * @param {Object} configure Configuration object.
   * @param {Object} proto     Constructor prototype.
   */
  return function Class(configure, proto) {

    var class_, traits, interfaces, temp, interf, extend;

    // check incoming 

    configure = configure || {};
    proto     = proto || {};
    extend    = (typeof configure.extends === 'function');

    if (typeof configure !== 'object') {
      throw new TypeError('`configure` must be of type Object.');
    }

    if (typeof proto !== 'object') {
      throw new TypeError('`proto` must be of type Object.');
    }

    // build class

    class_ = proto.hasOwnProperty('constructor')
      ? proto.constructor
      : function() { /* silent */ };

    // traits
    if (Array.isArray(configure.uses)) {
      traits = configure.uses.reverse();
      for (var t = 0, l = traits.length; t < l; ++t) {
        if (!(traits[t] instanceof Trait)) {
          throw new TypeError('Not an instance of Trait.');
        }
        mix(proto, traits[t]);
      }
    }

    // final
    Object.defineProperty(class_, '__final__', {
      value: Boolean(configure.final)
    });

    // extends
    if (extend) {
      if (configure.extends.__final__) {
        throw new Error('Cannot extend a final Class.');
      }
      class_ = inherit(class_, configure.extends, proto);
    }

    delete proto.constructor;
    for (var name in proto) {
      class_.prototype[name] = proto[name];
    }

    // interfaces
    if (Array.isArray(configure.implements)) {
      interfaces = configure.implements;
      for (var i = 0, n = interfaces.length; i < n; ++i) {
        if (!interfaces[i].implements) {
          throw new TypeError('Not an instance of Interface.');
        }

        if (!interfaces[i].implements(class_)) {
          throw new SyntaxError('Class does not implement interface.');
        }
      }
    }

    return class_;
  };
})();