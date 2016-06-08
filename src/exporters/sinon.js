'use strict';

const sinon = require('sinon');

function createSandbox(hugged) {
  const sandbox = sinon.sandbox.create();

  ['mock', 'spy', 'stub'].forEach((method) => {
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
  return (done) => {

    sandbox && sandbox.restore();
    done && typeof done === 'function' && done();
  };
}

module.exports = {
  createSandbox: createSandbox,
  restoreSandbox: restoreSandbox
};
