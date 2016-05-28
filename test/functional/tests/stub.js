'use strict';

module.exports = (test) => {
  const assert = test.assert;
  const stub = test.stub;

  return (done) => {
    const oUT = {
      method: () => {}
    };

    stub(oUT, 'method');

    assert.typeOf(oUT.method.throws, 'function');

    done();
  };
};
