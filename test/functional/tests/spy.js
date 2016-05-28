'use strict';

module.exports = (test) => {
  const assert = test.assert;
  const spy = test.spy;

  return (done) => {
    const oUT = {
      method: () => {}
    };
    spy(oUT, 'method');
    oUT.method();
    assert.callCount(oUT.method, 1);

    done();
  };
};
