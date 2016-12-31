'use strict';

var hugs = require('../../src/index');
var mocha = require('mocha');
var tap = require('tap');
var sinon = require('sinon');
var unroll = require('unroll');
var assert = require('assert');
var test = mocha.test;
var suite = mocha.suite;
var setup = mocha.setup;
var teardown = mocha.teardown;

var ava = {
  test: function () {},
  cb: function () {},
  beforeEach: function () {},
  afterEach: function () {}
};
ava.afterEach.always = function () {};

var sandbox;

sinon.assert.expose(assert, { prefix: '' });

unroll.use(test);

setup(function () {
  sandbox = sinon.sandbox.create();
});

teardown(function () {
  sandbox.restore();
});

suite('Hugs', function () {
  suite('api', function () {
    test(
        'when hugged lib is "ava"',
        function () {
          sandbox.stub(ava);
          var huggedLib = hugs(ava);
          var huggedInterface = Object.keys(huggedLib).sort();

          assert.equal(huggedInterface.length, 9);

          assert.deepEqual(
              huggedInterface,
              [
                'afterEach',
                'beforeEach',
                'cb',
                'createStubInstance',
                'match',
                'mock',
                'only',
                'spy',
                'stub'
              ]
          );
        }
    );

    test(
      'when hugged lib is "mocha"',
      function () {
        var huggedLib = hugs(mocha);
        var huggedInterface = Object.keys(huggedLib).sort();

        assert.equal(huggedInterface.length, 9);

        assert.deepEqual(
          huggedInterface,
          [
            'afterEach',
            'beforeEach',
            'cb',
            'createStubInstance',
            'match',
            'mock',
            'only',
            'spy',
            'stub'
          ]
        );
      }
    );

    test(
      'when hugged lib is "tap"',
      function () {
        var huggedLib = hugs(tap);
        var huggedInterface = Object.keys(huggedLib).sort();

        assert.equal(huggedInterface.length, 10);

        assert.deepEqual(
          huggedInterface,
          [
            '_afters',
            '_befores',
            'afterEach',
            'beforeEach',
            'cb',
            'createStubInstance',
            'match',
            'mock',
            'spy',
            'stub'
          ]
        );
      }
    );
  });

  suite('test execution', function () {
    var huggedLib;
    var testFn;

    beforeEach(function (done) {
      testFn = sandbox.spy();
      done();
    });

    suite.skip('AVA', function () {
      beforeEach(function (done) {
        huggedLib = hugs(ava);
        done();
      });
    });

    suite('Mocha', function () {
      beforeEach(function (done) {
        sandbox.stub(mocha, 'setup').yields();
        sandbox.stub(mocha, 'test');
        huggedLib = hugs(mocha);
        done();
      });

      test('successful test', function () {
        huggedLib('testName', testFn);

        assert.callCount(mocha.test, 1);
        assert.calledWith(mocha.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
      });

      test('unsuccessful test', function () {
        huggedLib('testName', testFn);

        assert.callCount(mocha.test, 1);
        assert.calledWith(mocha.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
      });

      suite('async', function () {
        var doneFn;
        var testObject;

        beforeEach(function (done) {
          doneFn = sandbox.spy();
          mocha.test.yields(doneFn);
          huggedLib = hugs(mocha);
          testObject = {
            // eslint-disable-next-line
            method: function (done) {}
          };
          done();
        });

        test('successful test', function () {
          testFn = sandbox.stub(testObject, 'method').yields(undefined);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.calledWith(doneFn, undefined);
        });

        test('unsuccessful test', function () {
          var err = Error('an error');

          testFn = sandbox.stub(testObject, 'method').yields(err);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.calledWith(doneFn, err);
        });
      });

      suite('lifecycle', function () {
        var lifeCycleFn;

        beforeEach(function () {
          lifeCycleFn = sandbox.stub();
        });

        test('beforeEach', function () {
          huggedLib.beforeEach(lifeCycleFn);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
          assert.callCount(mocha.setup, 1);
          assert.callCount(lifeCycleFn, 1);
        });

        test('afterEach', function () {
          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
        });
      });
    });

    suite('Tap', function () {
      var huggedLib;
      var testFn;
      var tapTest;
      var subTest;
      var subSubTest;
      var lifeCycleDoneFn;

      beforeEach(function () {
        tapTest = sandbox.stub(tap, 'test');
        huggedLib = hugs(tap);
        testFn = sandbox.stub();
        lifeCycleDoneFn = sandbox.spy();
        subSubTest = {
          end: sandbox.spy(function () {})
        };

        subTest = {
          afterEach: sandbox.stub(),
          beforeEach: sandbox.stub(),
          test: sandbox.stub().yields(subSubTest)
        };

        tapTest.onFirstCall().yields(subTest);
      });

      test('successful test', function () {
        var err = undefined;

        testFn.yields(err);

        huggedLib('testName', testFn);

        assert.callCount(tapTest, 1);
        assert.calledWith(tapTest, 'testName', sinon.match.func);
        assert.calledWith(subTest.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
        assert.calledWith(subSubTest.end, err);
      });

      test('unsuccessful test', function () {
        var err = Error('an error');

        testFn.yields(err);

        huggedLib('testName', testFn);

        assert.callCount(tapTest, 1);
        assert.calledWith(tapTest, 'testName', sinon.match.func);
        assert.calledWith(subTest.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
        assert.calledWith(subSubTest.end, err);
      });

      suite('lifecycle', function () {
        var lifeCycleFn;
        var err = undefined;

        beforeEach(function (done) {
          lifeCycleFn = sandbox.stub().yields();
          done();
        });

        test('beforeEach', function () {
          testFn.yields(err);

          subTest.beforeEach.yields(lifeCycleDoneFn);

          huggedLib.beforeEach(lifeCycleFn);
          huggedLib('testName', testFn);

          assert.callCount(tapTest, 1);
          assert.calledWith(tapTest, 'testName', sinon.match.func);
          assert.calledWith(subTest.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
          assert.calledWith(subSubTest.end, err);
          assert.callCount(subTest.beforeEach, 1);
          assert.callCount(lifeCycleFn, 1);
          assert.callCount(lifeCycleDoneFn, 1);
        });

        test('afterEach', function () {
          testFn.yields(err);

          subTest.afterEach.yields(lifeCycleDoneFn);

          huggedLib.afterEach(lifeCycleFn);
          huggedLib('testName', testFn);

          assert.callCount(tapTest, 1);
          assert.calledWith(tapTest, 'testName', sinon.match.func);
          assert.calledWith(subTest.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
          assert.calledWith(subSubTest.end, err);
          assert.callCount(subTest.afterEach, 2);
          assert.callCount(lifeCycleFn, 1);
          assert.callCount(lifeCycleDoneFn, 2);
        });
      });
    });
  });

  suite('matchers', function () {
    test(
        'when hugged lib is "ava"',
        function () {
          var huggedLib = hugs(ava);
          var spied = sandbox.spy();

          spied('foo');

          assert.calledWith(spied, huggedLib.match.string);
        }
    );

    test(
        'when hugged lib is "mocha"',
        function () {
          var huggedLib = hugs(mocha);
          var spied = sandbox.spy();

          spied('foo');

          assert.calledWith(spied, huggedLib.match.string);
        }
    );

    test(
        'when hugged lib is "tap"',
        function () {
          var huggedLib = hugs(tap);
          var spied = sandbox.spy();

          spied('foo');

          assert.calledWith(spied, huggedLib.match.string);
        }
    );
  });

  suite('incorrect hugging attempt', function () {
    test(
        'when hugged lib not a object or function',
        function () {
          assert.throws(
              function () {
                hugs('tapas');
              },
              /huggee is not valid target. Expected a function or an object/
          );
        }
    );
  });
});
