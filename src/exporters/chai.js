/*eslint-env browser, amd */
'use strict';

(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(
      [
      'sinon',
      'chai'
      ],
      factory
    );
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('sinon'),
      require('chai')
    );
  } else {
    root.chaiExporter = factory(root.sinon, root.chai);
  }
}(this, function (sinon, chai) {

  return {
    exportAsserts: function exportAsserts(hugged) {
      sinon.assert.expose(chai.assert, { prefix: '' });
      hugged.assert = chai.assert;
      hugged.chai = chai;
    }
  };
}));
