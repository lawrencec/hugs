'use strict';
const libName = process.env['HUGS_LIB'];
const expectedLibs = ['mocha', 'tap'];

if (expectedLibs.indexOf(libName) === -1) {
  // eslint-disable-next-line
  console.log(`"${libName}" not found in expected list of test libraries:  ${expectedLibs.join(', ')}`);
  process.exit(0);
}

const hugs = require('../src/index');
const testLib = require(libName);
const chaiAsPromised = require('chai-as-promised');
const test = hugs(testLib);
const assert = test.assert;
const mock = test.mock;
const spy = test.spy;
const stub = test.stub;
const chai = test.chai;

chai.use(chaiAsPromised);

const oUTAlpha = { method: () => { } };
const oUTBeta = { method: () => { } };

test.beforeEach((done) => {
  spy(oUTAlpha, 'method');
  done();
});

test.afterEach((done) => {
  done();
});

test(
  'assertion',
  (done) => {
    assert.callCount(oUTAlpha.method, 0);
    assert.equal(Object.keys(oUTAlpha).length, 1, 'number of methods do not match');
    done();
  }
);

test(
  'promise',
  () => {
    return Promise.resolve(2 + 2)
        .then((result) => {
          assert.equal(result, 4);
        });
  }
);

test(
  'promise with chai as promised',
  () => {
    const promise = Promise.resolve(2 + 2);

    return assert.eventually.equal(promise, 4);
  }
);

test(
  'async',
  (done) => {
    const val = true;

    setTimeout(() => {
      assert.equal(val, true);
      done();
    }, 50);
  }
);

test(
  'spy',
  (done) => {
    oUTAlpha.method(1, 2);

    assert.callCount(oUTAlpha.method, 1, 'callCount does not match');
    assert.calledWith(oUTAlpha.method, 1, 2);

    done();
  }
);

test(
  'mock',
  (done) => {
    const mocked = mock(oUTBeta);

    mocked.expects('method').never();
    mocked.verify();

    done();
  }
);

test(
  'stub',
  (done) => {
    stub(oUTBeta, 'method');
    assert.typeOf(oUTBeta.method.throws, 'function', 'expected "throws" to be a function');
    done();
  }
);

