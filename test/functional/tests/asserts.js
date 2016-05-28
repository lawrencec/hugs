'use strict';

module.exports = (test) => {
  const assert = test.assert;

  return (done) => {
    const oUT = {
      foo: 1,
      bar: 2
    };

    assert.equal(Object.keys(oUT).length, 2);

    done();
  };
};
