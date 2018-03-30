/*eslint-env browser, amd */
'use strict';

// eslint-disable-next-line complexity
(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(
      [
        '../exporters/sinon'
      ],
      factory
    );
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../exporters/sinon'),
      require('assert')
    );
  } else {
    root.hugMocha = factory(root.sinonExporter, root.assert, root);
  }
}(this, function (sinonExporter, assert, root) {
  function exportSandbox(hugged) {
    return sinonExporter.createSandbox(hugged);
  }

  function exportAsserts() {
    return sinonExporter.exportAsserts();
  }

  function exportOnly(hugged, huggee) {
    hugged.only = huggee.test.only;
  }

  function exportBefore(hugged, huggee) {
    hugged.beforeEach = huggee.setup;
  }

  function exportAfters(hugged, huggee, sandbox) {
    hugged.afterEach = huggee.teardown;
    hugged.afterEach(sinonExporter.restoreSandbox(sandbox));
  }

  function exportMatchers (hugged) {
    sinonExporter.exportMatchers(hugged);
  }

  function exportCreateStubInstance(hugged) {
    sinonExporter.exportCreateStubInstance(hugged);
  }

  function mochaHug(huggee) {
    var hugged = function (title, testFunc) {
      var isAsync = testFunc.length !== 0;
      var test = huggee.test;
      if (isAsync) {
        test(title, function (done) {
          return testFunc(function (err) {
            done && done(err);
          });
        });
      } else {
        test(title, function () {
          return testFunc();
        });
      }
    };
    hugged.cb = hugged;
    return hugged;
  }

  function resolveTargetFromEnv(window, huggee) {
    return (typeof window === 'undefined') ? huggee : {test: window.test, setup: window.setup, teardown: window.teardown};
  }

  return function (huggee) {
    huggee = resolveTargetFromEnv(root, huggee);

    var hugged = mochaHug(huggee);

    exportBefore(hugged, huggee);
    exportAfters(hugged, huggee, exportSandbox(hugged));
    exportAsserts();
    exportOnly(hugged, huggee);
    exportMatchers(hugged);
    exportCreateStubInstance(hugged);

    return hugged;
  };
}));
