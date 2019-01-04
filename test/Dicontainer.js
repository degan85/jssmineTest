 // Dicontainer
 DiContainer = function() {
   if(!(this instanceof DiContainer)) {
     return new DiContainer();
   }  
   this.registrations = [];
 };

// message
DiContainer.prototype.messages = {
  registerRequiresArgs : '이 생성자 함수는 인자가 3개 있어야 합니다: ' + '문자열, 문자열, 배열, 함수.'
};

// register function
DiContainer.prototype.register = function( name, dependencies, func) {
  var ix;

  // 인자 확인
  if (typeof name !== 'string'
  || !Array.isArray(dependencies)
  || typeof func !=='function') {
    throw new Error(this.messages.registerRequiresArgs);
  }
  for (ix=0; ix<dependencies.length; ++ix) {
    if (typeof dependencies[ix] !=='string') {
      throw new Error(this.messages.registerRequiresArgs);
    }
  }  
  
  // function 저장
  this.registrations[name] = { dependencies : dependencies, func : func };
 };

// get function
DiContainer.prototype.get = function(name) {
    var self = this,
        registration = this.registrations[name],
        dependencies = [];

    if( registration === undefined ) {
        return undefined;
    }

    registration.dependencies.forEach(function(dependencyName) {
        var dependency = self.get(dependencyName);
        dependencies.push( dependency === undefined ? undefined : dependency );
    });

    return registration.func.apply(undefined, dependencies);
};




// ===== test jasmine
describe('DContainer', function() {
  var container;
  beforeEach(function() {
    container = new DiContainer();
  });

    
  describe('get(name)', function() {
    it('성명이 등록되어 있지 않으면 undefined 반환', function() {
        expect(container.get('noDefined')).toBeUndefined();
    });

    it('등록된 함수를 실행한 결과를 반환한다', function() {
        var name = 'MyName',
            returnFromRegisteredFunction = 'something';
        container.register(name,[],function() {
            return returnFromRegisteredFunction;
        });

        expect(container.get(name)).toBe(returnFromRegisteredFunction);
    });

    it('등록된 함수에 의존성을 제공한다', function() {
        var main = 'main',
            mainFunc,
            dep1 = 'dep1',
            dep2 = 'dep2';

        container.register(main, [dep1, dep2], function(dep1Func, dep2Func) {
            return function() {
                return dep1Func() + dep2Func();
            };
        });
        container.register(dep1, [], function() {
            return function() {
                return 1;
            }
        });

        container.register(dep2, [], function() {
            return function() {
                return 2;
            }
        });

        mainFunc = container.get(main);

        expect(mainFunc()).toBe(3);
    });

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
