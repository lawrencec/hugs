'use strict';

var sinonExporter = require('../exporters/sinon');
var chaiExporter = require('../exporters/chai');

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
  var sandbox = exportSandbox(hugged);

  hugged.beforeEach = function (f) {
    huggee.beforeEach(sinonExporter.restoreSandbox(sandbox));
    huggee.beforeEach(function (t) {
      var done = function () {} ;
      Object.keys(t).forEach(function (p) {
        done[p] = t[p];
      });
      f(done);
    });
  };
}

function exportAfters(hugged, huggee) {
  hugged.afterEach = function (f) {
    huggee.afterEach(function (t) {
      var done = function () {};
      Object.keys(t).forEach(function (p) {
        done[p] = t[p];
      });
      f(done);
    });
  };
  hugged.afterEach.always = huggee.afterEach.always;
}

function exportMatchers (hugged) {
  sinonExporter.exportMatchers(hugged);
}

function exportCreateStubInstance(hugged) {
  sinonExporter.exportCreateStubInstance(hugged);
}

function hugAva(huggee) {
  var hugged = function mochaHug(title, testFunc) {
    huggee.test(title, function () {
      return testFunc(function () {});
    });
  };

  hugged.cb = function (title, testFunc) {
    huggee.test.cb(title, function (t) {
      return testFunc(function () {
        t && t.end && t.end();
      });
    });
  };
  return hugged;
}

module.exports = function (huggee) {
  var hugged = hugAva(huggee);

  exportBefore(hugged, huggee);
  exportAfters(hugged, huggee);
  exportChaiAsserts(hugged);
  exportOnly(hugged, huggee);
  exportMatchers(hugged);
  exportCreateStubInstance(hugged);

  return hugged;
};
