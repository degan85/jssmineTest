 // Dicontainer
 DiContainer = function() {
   if(!(this instanceof DiContainer)) {
     return new DiContainer();
   }  
 };

DiContainer.prototype.messages = {
  registerRequiresArgs : '이 생성자 함수는 인자가 3개 있어야 합니다: ' + '문자열, 문자열, 배열, 함수.'
};

DiContainer.prototype.register = function( name, dependencies, func) {
  var ix;

  if (typeof name !== 'string'
  || Array.isArray(dependencies)
  || typeof func !=='function') {
    throw new Error(this.messages.registerRequiresArgs);
  }
  for (ix=0; ix<dependencies.length; ++ix) {
    if (typeof dependencies[ix] !=='string') {
      throw new Error(this.messages.registerRequiresArgs);
    }
  }  
 };





// ===== test jasmine
describe('DContainer', function() {
  var container;
  beforeEach(function() {
    container = new DiContainer();
  });

  describe('register(name, dependencies, func)', function() {

    // 01
    it('when no arg or bad type throw exception', function() {
      var badArgs = [

        // no args
        [],
        
        // only have name
        ['Name'],

        // only have name and dependencies
        ['Name', ['Dependency1', 'Dependency2']],
        ['Name', function() {}],
        [1,['a','b'], function() {}],
        [1,[1,2], function() {}],
        ['Name', ['a','b'], 'should be a function']
      ];

      badArgs.forEach(function(args) {
        expect(function() {
          container.register.apply(container, args);
        }).toThrowError(container.messages.registerRequiresArgss);
      });  
    });
  });
 }); 
