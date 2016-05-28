'use strict';

const sinonExporter = require('../exporters/sinon');
const chaiExporter = require('../exporters/chai');

function exportSandbox(hugged) {
  return sinonExporter.createSandbox(hugged);
}

function exportChaiAsserts(hugged) {
  return chaiExporter.exportAsserts(hugged);
}

function invokeLifeCycleCallback(lifeCycleTargets, lifeCycleMethod) {
  if (lifeCycleTargets && lifeCycleTargets.length) {
    lifeCycleTargets.forEach((fn) => {
      lifeCycleMethod((done) => {
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

function hug(huggee) {
  const hugged = function tapHug(title, testFunc) {
    huggee.test(title, (t) => {
      invokeLifeCycleCallback(hugged._befores, t.beforeEach);
      invokeLifeCycleCallback(hugged._afters, t.afterEach);

      return t.test(title, (tt) => {
        return testFunc((err) => {
          tt && tt.end(err);
        });
      });
    });
  };
  return hugged;
}

module.exports = (huggee) => {
  const hugged = hug(huggee);

  exportBeforeCallbacks(hugged);
  exportAfterCallbacks(hugged, exportSandbox(hugged));
  exportChaiAsserts(hugged);

  return hugged;
};
