/*jslint node: true,nomen: true */
/*globals module */

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            pre: ['dist', 'coverage'],
            post: [ 'dist/server' ]
        },
        copy: {
            lib: {
                expand: true,
                cwd: 'lib',
                src: '**',
                dest: 'dist/server/lib'
            },
            start: {
                expand: true,
                cwd: '.',
                src: 'start.js',
                dest: 'dist/server/'
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist/pkservercraft-api.zip'
                },
                files: [
                    {
                        cwd: 'dist/server/',
                        src: ['**/*'],
                        dest: '/'
                    }
                ]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('build', ['test', 'copy']);
    grunt.registerTask('package', ['compress', 'clean:post']);

    grunt.registerTask('install', ['clean:pre', 'build', 'package']);
};
