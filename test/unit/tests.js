'use strict';

const hugs = require('../../src/index');
const mocha = require('mocha');
const tap = require('tap');
const sinon = require('sinon');
const unroll = require('unroll');
const assert = require('assert');
const test = mocha.test;
const suite = mocha.suite;
const setup = mocha.setup;
const teardown = mocha.teardown;

let sandbox;

sinon.assert.expose(assert, { prefix: '' });
unroll.use(test);

setup(() => {
  sandbox = sinon.sandbox.create();
});

teardown(() => {
  sandbox.restore();
});

suite('Hugs', () => {
  suite('api', () => {
    test(
      'when hugged lib is "mocha"',
      () => {
        const huggedLib = hugs(mocha);
        const huggedInterface = Object.keys(huggedLib).sort();

        assert.equal(huggedInterface.length, 8);

        assert.deepEqual(
          huggedInterface,
          [
            'afterEach',
            'assert',
            'beforeEach',
            'chai',
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
      () => {
        const huggedLib = hugs(tap);
        const huggedInterface = Object.keys(huggedLib).sort();

        assert.equal(huggedInterface.length, 9);

        assert.deepEqual(
          huggedInterface,
          [
            '_afters',
            '_befores',
            'afterEach',
            'assert',
            'beforeEach',
            'chai',
            'mock',
            'spy',
            'stub'
          ]
        );
      }
    );
  });

  suite('test execution', () => {
    let huggedLib;
    let testFn;

    beforeEach((done) => {
      sandbox.stub(mocha, 'setup').yields();
      sandbox.stub(mocha, 'test');
      huggedLib = hugs(mocha);
      testFn = sandbox.spy();
      done();
    });

    suite('Mocha', () => {
      test('successful test', () => {
        huggedLib('testName', testFn);

        assert.callCount(mocha.test, 1);
        assert.calledWith(mocha.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
      });

      test('unsuccessful test', () => {
        huggedLib('testName', testFn);

        assert.callCount(mocha.test, 1);
        assert.calledWith(mocha.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
      });

      suite('async', () => {
        let doneFn;
        let testObject;

        beforeEach((done) => {
          doneFn = sandbox.spy();
          mocha.test.yields(doneFn);
          huggedLib = hugs(mocha);
          testObject = {
            // eslint-disable-next-line
            method: (done) => {}
          };
          done();
        });

        test('successful test', () => {
          testFn = sandbox.stub(testObject, 'method').yields(undefined);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.calledWith(doneFn, undefined);
        });

        test('unsuccessful test', () => {
          const err = Error('an error');

          testFn = sandbox.stub(testObject, 'method').yields(err);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.calledWith(doneFn, err);
        });
      });

      suite('lifecycle', () => {
        let lifeCycleFn;

        beforeEach(() => {
          lifeCycleFn = sandbox.stub();
        });

        test('beforeEach', () => {
          huggedLib.beforeEach(lifeCycleFn);

          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
          assert.callCount(mocha.setup, 1);
          assert.callCount(lifeCycleFn, 1);
        });

        test('afterEach', () => {
          huggedLib('testName', testFn);

          assert.callCount(mocha.test, 1);
          assert.calledWith(mocha.test, 'testName', sinon.match.func);
          assert.callCount(testFn, 1);
        });
      });
    });

    suite('Tap', () => {
      let huggedLib;
      let testFn;
      let tapTest;
      let subTest;
      let subSubTest;
      let lifeCycleDoneFn;

      beforeEach(() => {
        tapTest = sandbox.stub(tap, 'test');
        huggedLib = hugs(tap);
        testFn = sandbox.stub();
        lifeCycleDoneFn = sandbox.spy();
        subSubTest = {
          end: sandbox.spy(()=> {})
        };

        subTest = {
          afterEach: sandbox.stub(),
          beforeEach: sandbox.stub(),
          test: sandbox.stub().yields(subSubTest)
        };

        tapTest.onFirstCall().yields(subTest);
      });

      test('successful test', () => {
        const err = undefined;

        testFn.yields(err);

        huggedLib('testName', testFn);

        assert.callCount(tapTest, 1);
        assert.calledWith(tapTest, 'testName', sinon.match.func);
        assert.calledWith(subTest.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
        assert.calledWith(subSubTest.end, err);
      });

      test('unsuccessful test', () => {
        const err = Error('an error');

        testFn.yields(err);

        huggedLib('testName', testFn);

        assert.callCount(tapTest, 1);
        assert.calledWith(tapTest, 'testName', sinon.match.func);
        assert.calledWith(subTest.test, 'testName', sinon.match.func);
        assert.callCount(testFn, 1);
        assert.calledWith(subSubTest.end, err);
      });

      suite('lifecycle', () => {
        let lifeCycleFn;
        const err = undefined;

        beforeEach((done) => {
          lifeCycleFn = sandbox.stub().yields();
          done();
        });

        test('beforeEach', () => {
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

        test('afterEach', () => {
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
});
