var Carbon = require('../index');


var HumanInterface = Carbon.Interface([ 'eat', 'sleep' ]);
var HumanTrait = Carbon.Trait({
  eat: function() {
    return 'nom nom';
  },
  sleep: function() {
    return 'Zzz';
  }
});
var Human = Carbon.Class({
  uses: [ HumanTrait ]
});


var PersonInterface = Carbon.Interface([ 'talk' ]);
var PersonTrait = Carbon.Trait({
  talk: function(echo) {
    return this.name + ' echoed: ' + echo;
  }
});
var Person = Carbon.Class({
  extends: Human,
  uses: [ PersonTrait ]
}, {
  constructor: function(name) {
    this.name = name;
  }
});


var BoyInterface = Carbon.Interface([ 'isOld' ]);
var Boy = Carbon.Class({
  extends: Person,
  implements: [ HumanInterface, PersonInterface, BoyInterface ]
}, {
  constructor: function(name, age) {
    this.parent_.constructor(name);
    this.age = age;
  },
  isOld: function() {
    return (this.age >= 21); 
  }
});



var me = new Boy('Chris', 26);

console.log(me.eat());
console.log(me.talk('howdy'));
console.log(me.isOld());

console.assert(me instanceof Human);
console.assert(me instanceof Person);
console.assert(me instanceof Boy);
console.assert(HumanInterface.implements(me));
console.assert(PersonInterface.implements(me));
console.assert(BoyInterface.implements(me));