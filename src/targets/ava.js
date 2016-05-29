'use strict';

const sinonExporter = require('../exporters/sinon');
const chaiExporter = require('../exporters/chai');

function exportSandbox(hugged) {
  return sinonExporter.createSandbox(hugged);
}

function exportChaiAsserts(hugged) {
  return chaiExporter.exportAsserts(hugged);
}

function exportOnly(hugged, huggee) {
  hugged.only = huggee.test.only;
}

function exportBefore(hugged, huggee) {
  hugged.beforeEach = (f) => {
    huggee.beforeEach((t) => {
      const done = () => {};
      Object.keys(t).forEach((p) => {
        done[p] = t[p];
      });
      f(done);
    });
  };
}

function exportAfters(hugged, huggee, sandbox) {
  hugged.afterEach = (f) => {
    huggee.afterEach((t) => {
      const done = () => {};
      Object.keys(t).forEach((p) => {
        done[p] = t[p];
      });
      f(done);
    });
  };
  hugged.afterEach.always = huggee.afterEach.always;
  hugged.afterEach.always(sinonExporter.restoreSandbox(sandbox));
}

function hugAva(huggee) {
  const hugged = function mochaHug(title, testFunc) {
    huggee.test(title, () => {
      return testFunc(()=>{});
    });
  };

  hugged.cb = function (title, testFunc) {
    huggee.test.cb(title, (t) => {
      return testFunc(()=>{
        t && t.end && t.end();
      });
    });
  };
  return hugged;
}

module.exports = (huggee) => {
  const hugged = hugAva(huggee);

  exportBefore(hugged, huggee);
  exportAfters(hugged, huggee, exportSandbox(hugged));
  exportChaiAsserts(hugged);
  exportOnly(hugged, huggee);

  return hugged;
};
