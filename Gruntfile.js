'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    // Project configuration.
    var config = {

        distdir: 'dist',
        builddir: 'build',

        pkg: grunt.file.readJSON('package.json'),

        src: {
            // This will cover all JS files in 'js' and sub-folders
            js: ['src/js/**/*.js'],
            templates: ['src/templates/**/*.html'],
        },

        test: {
            karmaConfig: 'test/config/karma.conf.js',
            unit: ['test/unit/**/*.js']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {
                src: ['Gruntfile.js', '<%= src.js %>', '<%= test.unit %>']
            }
        },

        karma: {
            // Used in local development
            local: {
                configFile: '<%= test.karmaConfig %>',
                singleRun: true,
                //browsers: ['Chrome']
            }
        },

        ngtemplates: {
            ngPaginatorPlz: {
                src: ['<%= src.templates %>'],
                dest: '<%= builddir %>/custom_angular.js',
                options: {
                    concat: 'dist'
                }
            },
        },

        // html2js: {
        //     options: {
        //         base: '',
        //         module: 'paginatorTemplates'
        //     },
        //     main: {
        //         src: "<%= src.templates %>",
        //         dest: "<%= builddir %>/templates.js"
        //     }
        // },

        concat: {
            dist: {
                src: ['<%= src.js %>'],
                dest: '<%= distdir %>/<%= pkg.name %>.js'
            }
        }
    };

    grunt.initConfig(config);

    // Load plugins from package.json
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['jshint', 'karma:local']);
    grunt.registerTask('release', ['jshint', 'karma:local', 'ngtemplates', 'concat']);

};