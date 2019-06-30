module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/*.js',
      'test/*.js'
    ],
    browsers: ['ChromeHeadless'],
    reporters: ['dots']
  });
};
