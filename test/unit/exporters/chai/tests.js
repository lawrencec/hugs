'use strict';

const chaiExporter = require('../../../../src/exporters/chai');
const mocha = require('mocha');
const sinon = require('sinon');
const unroll = require('unroll');
const assert = require('assert');
const test = mocha.test;
const suite = mocha.suite;
const setup = mocha.setup;
const teardown = mocha.teardown;

let sandbox;

sinon.assert.expose(assert, { prefix: '' });

unroll.use(test);

setup(() => {
  sandbox = sinon.sandbox.create();

});

teardown(() => {
  sandbox.restore();
});

suite('Chai exporter', () => {
  test('exportAsserts', () => {
    const target = {};
    chaiExporter.exportAsserts(target);

    assert.equal(typeof target.assert, 'function');
  });
});
