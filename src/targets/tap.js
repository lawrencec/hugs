'use strict';
var sinonExporter = require('../exporters/sinon');
var chaiExporter = require('../exporters/chai');

function exportSandbox(hugged) {
  return sinonExporter.createSandbox(hugged);
}

function exportChaiAsserts(hugged) {
  return chaiExporter.exportAsserts(hugged);
}

function invokeLifeCycleCallback(lifeCycleTargets, lifeCycleMethod) {
  if (lifeCycleTargets && lifeCycleTargets.length) {
    lifeCycleTargets.forEach(function (fn) {
      lifeCycleMethod(function (done) {
        fn(done);
      });
    });
  }
}

function exportLifeCycleCallbacks(lifeCycleTarget) {
  return function (cb) {
    lifeCycleTarget.push(cb);
  };
}

function exportBeforeCallbacks(hugged) {
  hugged.beforeEach = exportLifeCycleCallbacks(hugged._befores = []);
}

function exportAfterCallbacks(hugged, sandbox) {
  hugged.afterEach = exportLifeCycleCallbacks(hugged._afters = []);
  hugged.afterEach(sinonExporter.restoreSandbox(sandbox));
}

function exportMatchers (hugged) {
  sinonExporter.exportMatchers(hugged);
}

function exportCreateStubInstance(hugged) {
  sinonExporter.exportCreateStubInstance(hugged);
}

function hug(huggee) {
  var hugged = function tapHug(title, testFunc) {
    huggee.test(title, function (t) {
      invokeLifeCycleCallback(hugged._befores, t.beforeEach);
      invokeLifeCycleCallback(hugged._afters, t.afterEach);

      return t.test(title, function (tt) {
        return testFunc(function (err) {
          tt && tt.end(err);
        });
      });
    });
  };
  hugged.cb = hugged;
  return hugged;
}

module.exports = function (huggee) {
  var hugged = hug(huggee);

  exportBeforeCallbacks(hugged);
  exportAfterCallbacks(hugged, exportSandbox(hugged));
  exportChaiAsserts(hugged);
  exportMatchers(hugged);
  exportCreateStubInstance(hugged);

  return hugged;
};
