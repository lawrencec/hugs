'use strict';

var sinonExporter = require('../../../../src/exporters/sinon');
var mocha = require('mocha');
var sinon = require('sinon');
var unroll = require('unroll');
var assert = require('assert');
var test = mocha.test;
var suite = mocha.suite;
var setup = mocha.setup;
var teardown = mocha.teardown;

var sandbox;

sinon.assert.expose(assert, { prefix: '' });

unroll.use(test);

setup(function () {
  sandbox = sinon.sandbox.create();

});

teardown(function () {
  sandbox.restore();
});

suite('Sinon exporter', function () {
  test('createSandbox', function () {
    var target = {};
    sinonExporter.createSandbox(target);

    assert.equal(typeof target.spy, 'function');
    assert.equal(typeof target.stub, 'function');
    assert.equal(typeof target.mock, 'function');
  });

  test('exportMatchers', function () {
    var target = {};
    sinonExporter.exportMatchers(target);

    assert.equal(typeof target.match, 'function');
  });

  test('exportCreateStubInstance', function () {
    var target = {};
    sinonExporter.exportCreateStubInstance(target);

    assert.equal(typeof target.createStubInstance, 'function');
  });

  suite('restoreSandbox', function () {
    test('with a sandbox', function () {
      var target = {};
      var sandbox = sinonExporter.createSandbox(target);
      var doneFn = sandbox.spy();

      sinonExporter.restoreSandbox(sandbox)(doneFn);

      assert.called(doneFn);
    });

    test('without a sandbox', function () {
      var doneFn = sandbox.spy();

      sinonExporter.restoreSandbox(undefined)(doneFn);

      assert.called(doneFn);
    });
  });

  suite('sandbox methods are delegated correctly', function () {
    unroll(
      'for method #method',
      function (done, testArgs) {
        var aThing = {
          method: function () {
          }
        };

        var target = {};
        var sandbox = sinonExporter.createSandbox(target);

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

    test('for method "mock"', function () {
      var aThing = {
        method: function () {
        }
      };

      var target = {};
      var sandbox = sinonExporter.createSandbox(target);

      sandbox.spy(sandbox, 'mock');

      target.mock(aThing);

      assert.calledWith(sandbox.mock, aThing);
    });
  });
});
