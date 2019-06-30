var request = require('request');

module.exports = function(grunt) {

  /**
   * Build given file - wrap it with a function call
   * TODO(vojta): compile with uglify-js
   */
  grunt.registerMultiTask('build', 'Wrap given file into a function call.', function() {

    var src = grunt.file.expand(this.data).pop();
    var dest = src.replace('src/', 'client/');
    var wrapper = src.replace('.js', '.wrapper');

    grunt.file.copy(wrapper, dest, {process: function(content) {
        var wrappers = content.split(/%CONTENT%\r?\n/);
        return wrappers[0] + grunt.file.read(src) + wrappers[1];
      }});

    grunt.log.ok('Created ' + dest);
  });

  grunt.task.registerTask('post-result', 'Post the result', function() {
    const done = this.async();
    grunt.task.requires('karma:client');

    if (process.env.TRAVIS_COMMIT) {
      request.post(`https://api.github.com/repos/jamcoupe/karma-commonjs/statuses/${process.env.TRAVIS_COMMIT}`, {
        json: {
          state: "success",
          target_url: process.env.TRAVIS_BUILD_WEB_URL,
          description: "The build succeeded!",
          context: "continuous-integration/travis",
        },
        headers: {
          'User-Agent': 'jamcoupe',
        }
      }, (err, result) => {
        if (err) {
          done(1);
        } else {
          grunt.log.ok("Status sent to github");
          done(0);
        }
      });
    } else {
      grunt.log.warn("TRAVIS_COMMIT not found in env no status will be sent to github");
      done(0);
    }
  });
};
