'use strict';

module.exports = (test) => {
  const assert = test.assert;
  const spy = test.spy;

  return () => {
    const oUT = {
      method: () => {}
    };
    spy(oUT, 'method');

    return Promise.resolve(2 + 2)
      .then((result) => {
        assert.equal(result, 4);
        assert.callCount(oUT.method, 0);
      });
  };
};
