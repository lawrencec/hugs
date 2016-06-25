'use strict';

var chaiExporter = require('../../../../src/exporters/chai');
var mocha = require('mocha');
var sinon = require('sinon');
var unroll = require('unroll');
var assert = require('assert');
var test = mocha.test;
var suite = mocha.suite;
var setup = mocha.setup;
var teardown = mocha.teardown;
var sandbox;

sinon.assert.expose(assert, { prefix: '' });

unroll.use(test);

setup(function () {
  sandbox = sinon.sandbox.create();

});

teardown(function () {
  sandbox.restore();
});

suite('Chai exporter', function () {
  test('exportAsserts', function () {
    var target = {};
    chaiExporter.exportAsserts(target);

    assert.equal(typeof target.assert, 'function');
  });
});
