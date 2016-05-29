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
  hugged.beforeEach = huggee.setup;
}

function exportAfters(hugged, huggee, sandbox) {
  hugged.afterEach = huggee.teardown;
  hugged.afterEach(sinonExporter.restoreSandbox(sandbox));
}

function hugMocha(huggee) {
  const hugged = function mochaHug(title, testFunc) {
    const isAsync = testFunc.length !== 0;

    if (isAsync) {
      huggee.test(title, (done) => {
        return testFunc((err) => {
          done && done(err);
        });
      });
    } else {
      huggee.test(title, () => {
        return testFunc();
      });
    }
  };
  hugged.cb = hugged;
  return hugged;
}

module.exports = (huggee) => {
  const hugged = hugMocha(huggee);

  exportBefore(hugged, huggee);
  exportAfters(hugged, huggee, exportSandbox(hugged));
  exportChaiAsserts(hugged);
  exportOnly(hugged, huggee);

  return hugged;
};
