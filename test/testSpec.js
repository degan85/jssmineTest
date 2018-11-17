var test = require('./test1');

describe('tset', function() {
  it('test true', function() {
     expect(test.foo).toBe(true);
  });

  it('test false', function() {
     expect(test.bar).toBe(false);
  });
});
