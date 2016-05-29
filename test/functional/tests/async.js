'use strict';

module.exports = (test) => {
  const assert = test.assert;

  return (done) => {
    const val = true;

    setTimeout(() => {
      assert.equal(val, true);

      done();
    }, 50);
  };
};
