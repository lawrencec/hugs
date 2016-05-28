'use strict';

module.exports = (test) => {
  const assert = test.assert;

  return (done) => {
    const val = true;

    ((result) => {
      assert.equal(result, true);

      done();
    }).apply(null, [val]);
  };
};
