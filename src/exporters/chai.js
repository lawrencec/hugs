'use strict';

const sinon = require('sinon');
const chai = require('chai');

function exportAsserts(hugged) {
  sinon.assert.expose(chai.assert, { prefix: '' });
  hugged.assert = chai.assert;
  hugged.chai = chai;
}

module.exports = {
  exportAsserts: exportAsserts
};
