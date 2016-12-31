var path = require('path');

module.exports = function (config) {
  var libName = process.env['HUGS_TEST_LIB'] || 'unspecified test lib';
  var expectedLibs = ['mocha', 'jasmine'];

  if (expectedLibs.indexOf(libName) === -1) {
    // eslint-disable-next-line
    throw Error(libName + ' not found in expected list of test libraries: ' + expectedLibs.join(', ') + '. Specify via HUGS_TEST_LIB env var');
  } else {
    config.set({
      // base path, that will be used to resolve files and exclude
      basePath: '../../../../',

      frameworks: [libName, 'sinon', 'power-assert'],

      // list of files / patterns to load in the browser
      files: [
        'node_modules/babel-polyfill/dist/polyfill.js',
        'src/exporters/sinon.js',
        'src/targets/' + libName + '.js',
        'src/index.js',
        './test/functional/browsers/tests.js'
      ],

      // list of files to exclude
      exclude: [],

      preprocessors: {
        'lib/*.js': ['coverage'],
        './test/functional/browsers/tests.js': ['espower']
      },

      // use dots reporter, as travis terminal does not support escaping sequences
      // possible values: 'dots', 'progress'
      // CLI --reporters progress
      reporters: ['spec', 'junit', 'coverage'],

      junitReporter: {
        outputDir: ['./target/browsers',libName,''].join(path.sep),
        outputFile: 'test-results.xml'
      },

      coverageReporter: {
        type: 'html',
        dir: ['./target/browsers', libName, 'coverage'].join(path.sep)
      },

      // web server port
      // CLI --port 9876
      port: 9876,

      // enable / disable colors in the output (reporters and logs)
      // CLI --colors --no-colors
      colors: true,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      // CLI --log-level debug
      logLevel: config.LOG_INFO,

      // enable / disable watching file and executing tests whenever any file changes
      // CLI --auto-watch --no-auto-watch
      autoWatch: true,

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      // CLI --browsers Chrome,Firefox,Safari
      browsers: ['PhantomJS'],

      // If browser does not capture in given timeout [ms], kill it
      // CLI --capture-timeout 5000
      captureTimeout: 20000,

      // Auto run tests on start (when browsers are captured) and exit
      // CLI --single-run --no-single-run
      singleRun: true,

      // report which specs are slower than 500ms
      // CLI --report-slower-than 500
      reportSlowerThan: 500,

      client: {
        mocha: {
          reporter: 'html', // change Karma's debug.html to the mocha web reporter
          ui: 'tdd'
        }
      }
    });
  }
};
