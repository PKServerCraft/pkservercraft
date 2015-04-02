/*jslint node: true,nomen: true */
/*globals module */

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist', 'coverage'],
        copy: {

        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['spec/**/*.spec.js']
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'lib/**/*.js', 'spec/**/*.spec.js'],
                tasks: ['test']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('clean', 'clean');
    grunt.registerTask('install', ['']);
};
