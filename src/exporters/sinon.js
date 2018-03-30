/*eslint-env browser, amd */
'use strict';

// eslint-disable-next-line complexity
(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(
        [
          'sinon',
          'assert'
        ],
        factory
    );
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('sinon'),
      require('assert')
    );
  } else {
    root.sinonExporter = factory(root.sinon, root.assert);
  }
}(this, function (sinon, assert) {
  function createSandbox(hugged) {
    var sandbox = sinon.sandbox.create();

    ['mock', 'spy', 'stub'].forEach(function (method) {
      hugged[method] = applySandboxMethod(method, sandbox);
    });

    return sandbox;
  }

  function applySandboxMethod(method, sandbox) {
    return function () {
      return sandbox[method].apply(sandbox, arguments);
    };
  }

  function restoreSandbox(sandbox) {
    // eslint-disable-next-line complexity
    return function (done) {
      sandbox && sandbox.restore();
      done && typeof done === 'function' && done();
    };
  }

  function exportMatchers(hugged) {
    hugged.match = sinon.match;
  }

  function exportCreateStubInstance(hugged) {
    hugged.createStubInstance = sinon.createStubInstance;
  }

  function exportAsserts() {
    sinon.assert.expose(assert, { prefix: '' });
  }

  return {
    createSandbox: createSandbox,
    restoreSandbox: restoreSandbox,
    exportAsserts: exportAsserts,
    exportMatchers: exportMatchers,
    exportCreateStubInstance: exportCreateStubInstance
  };
}));
