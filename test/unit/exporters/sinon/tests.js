'use strict';

const sinonExporter = require('../../../../src/exporters/sinon');
const mocha = require('mocha');
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

suite('Sinon exporter', () => {
  test('createSandbox', () => {
    const target = {};
    sinonExporter.createSandbox(target);

    assert.equal(typeof target.spy, 'function');
    assert.equal(typeof target.stub, 'function');
    assert.equal(typeof target.mock, 'function');
  });

  suite('restoreSandbox', () => {
    test('with a sandbox', () => {
      const target = {};
      const sandbox = sinonExporter.createSandbox(target);
      const doneFn = sandbox.spy();

      sinonExporter.restoreSandbox(sandbox)(doneFn);

      assert.called(doneFn);
    });

    test('without a sandbox', () => {
      const doneFn = sandbox.spy();

      sinonExporter.restoreSandbox(undefined)(doneFn);

      assert.called(doneFn);
    });
  });

  suite('sandbox methods are delegated correctly', () => {
    unroll(
      'for method #method',
      (done, testArgs) => {
        const aThing = {
          method: () => {
          }
        };

        const target = {};
        const sandbox = sinonExporter.createSandbox(target);

        sandbox.spy(sandbox, testArgs.method);

        target[testArgs.method](aThing, 'method');

        assert.calledWith(sandbox[testArgs.method], aThing, 'method');
        done();
      },
      [
        ['method'],
        ['spy'],
        ['stub']
      ]
    );

    test('for method "mock"', () => {
      const aThing = {
        method: () => {
        }
      };

      const target = {};
      const sandbox = sinonExporter.createSandbox(target);

      sandbox.spy(sandbox, 'mock');

      target.mock(aThing);

      assert.calledWith(sandbox.mock, aThing);
    });
  });
});
