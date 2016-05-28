'use strict';

module.exports = (test) => {
  const assert = test.assert;
  const mock = test.mock;

  return (done) => {
    const oUT = {
      method: () => {}
    };
    const mocked = mock(oUT);

    assert.typeOf(mocked.verify, 'function');
    mocked.expects('method').never();
    mocked.verify();
    done();
  };
};
