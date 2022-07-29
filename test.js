//Add your tests here
var assertion = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('It should return -1 if value is not present', function () {
      assertion.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});




