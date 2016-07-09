/*eslint-env browser, amd */
'use strict';

(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(
        [
          'sinon'
        ],
        factory
    );
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('sinon')
    );
  } else {
    root.sinonExporter = factory(root.sinon);
  }
}(this, function (sinon) {
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

  return {
    createSandbox: createSandbox,
    restoreSandbox: restoreSandbox,
    exportMatchers: exportMatchers,
    exportCreateStubInstance: exportCreateStubInstance
  };
}));
