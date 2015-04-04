/*jslint node: true,nomen: true */
/*globals module,pkg */

"use strict";

module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');
    function buildVersion() {
        var retVal = pkg.version,
            buildNumber = process.env.TRAVIS_BUILD_NUMBER;

        if (buildNumber === undefined) {
            buildNumber = "SNAPSHOT";
        }

        if ((process.env.TRAVIS_BRANCH === "master") || (buildNumber === "SNAPSHOT")) {
            retVal += ((buildNumber === "SNAPSHOT") ? "-" : "-build") + buildNumber;
        } else {
            retVal += "-dev" + buildNumber;
        }

        return retVal;
    }
    grunt.initConfig({
        pkg: pkg,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
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
        aws_s3: {
            options: {
                accessKeyId: '<%= AWS_ACCESS_KEY_ID %>', // Use the variables
                secretAccessKey: '<%= AWS_SECRET_ACCESS_KEY %>', // You can also use env variables
                region: 'us-east-1',
                uploadConcurrency: 5,
                downloadConcurrency: 5,
                bucket: 'deployment.paulkimbrel.com'
            },
            deploy: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: '/'
                    }
                ]
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist/<%= pkg.name %>/' + buildVersion() + '/<%= pkg.name %>-api.zip'
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
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('build', ['test', 'copy']);
    grunt.registerTask('package', ['compress', 'clean:post']);

    grunt.registerTask('install', ['clean:pre', 'build', 'package']);
    grunt.registerTask('deploy', 'aws_s3');
};
