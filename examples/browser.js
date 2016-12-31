/*eslint-env browser */
'use strict';

var libName = window.mocha ? 'mocha' : 'jasmine';
var expectedLibs = ['mocha', 'jasmine'];

if (expectedLibs.indexOf(libName) === -1) {
  // eslint-disable-next-line
  console.log(libName + ' not found in expected list of test libraries: ' + expectedLibs.join(', '));
}

var testLib = window[libName];
var test = window.hugs(testLib);
var mock = test.mock;
var spy = test.spy;
var stub = test.stub;

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
    'assertion (' + libName + ')',
    function (done) {
      assert.callCount(oUTAlpha.method, 0);
      assert.equal(Object.keys(oUTAlpha).length, 1, 'number of methods do not match');
      done();
    }
);

test(
    'promise (' + libName + ')',
    function () {
      return Promise.resolve(2 + 2)
          .then(function (result) {
            assert.equal(result, 4);
          });
    }
);

test.cb(
    'async (' + libName + ')',
    function (done) {
      var val = true;

      setTimeout(function () {
        assert.equal(val, true);
        done();
      }, 50);
    }
);

test(
    'spy (' + libName + ')',
    function (done) {
      oUTAlpha.method(1, 2);

      assert.callCount(oUTAlpha.method, 1, 'callCount does not match');
      assert.calledWith(oUTAlpha.method, 1, 2);

      done();
    }
);

test(
    'mock (' + libName + ')',
    function (done) {
      var mocked = mock(oUTBeta);

      mocked.expects('method').never();
      mocked.verify();

      done();
    }
);

test(
    'stub (' + libName + ')',
    function (done) {
      stub(oUTBeta, 'method');
      assert.equal(typeof oUTBeta.method.throws, 'function', 'expected "throws" to be a function');
      done();
    }
);

