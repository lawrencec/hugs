'use strict';
var libName = process.env['HUGS_LIB'];
var expectedLibs = ['ava', 'mocha', 'tap'];

if (expectedLibs.indexOf(libName) === -1) {
  // eslint-disable-next-line
  console.log(libName + ' not found in expected list of test libraries: ' + expectedLibs.join(', '));
  process.exit(0);
}

var hugs = require('../src/index');
var testLib = require(libName);
var chaiAsPromised = require('chai-as-promised');
var test = hugs(testLib);
var assert = test.assert;
var mock = test.mock;
var spy = test.spy;
var stub = test.stub;
var chai = test.chai;

chai.use(chaiAsPromised);

var oUTAlpha = { method: function () {} };
var oUTBeta = { method: function () {} };

test.beforeEach(function (done) {
  spy(oUTAlpha, 'method');
  done && done();
});

test.afterEach(function (done) {
  done && done();
});

test(
  'assertion',
  function (done) {
    assert.callCount(oUTAlpha.method, 0);
    assert.equal(Object.keys(oUTAlpha).length, 1, 'number of methods do not match');
    done();
  }
);

test(
  'promise',
  function () {
    return Promise.resolve(2 + 2)
        .then(function (result) {
          assert.equal(result, 4);
        });
  }
);

test(
  'promise with chai as promised',
  function () {
    var promise = Promise.resolve(2 + 2);

    return assert.eventually.equal(promise, 4);
  }
);

test.cb(
  'async',
  function (done) {
    var val = true;

    setTimeout(function () {
      assert.equal(val, true);
      done();
    }, 50);
  }
);

test(
  'spy',
  function (done) {
    oUTAlpha.method(1, 2);

    assert.callCount(oUTAlpha.method, 1, 'callCount does not match');
    assert.calledWith(oUTAlpha.method, 1, 2);

    done();
  }
);

test(
  'mock',
  function (done) {
    var mocked = mock(oUTBeta);

    mocked.expects('method').never();
    mocked.verify();

    done();
  }
);

test(
  'stub',
  function (done) {
    stub(oUTBeta, 'method');
    assert.typeOf(oUTBeta.method.throws, 'function', 'expected "throws" to be a function');
    done();
  }
);

