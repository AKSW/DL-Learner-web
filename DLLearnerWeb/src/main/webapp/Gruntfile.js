module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');

    var concatName = "<%= pkg.name %>-<%= pkg.version %>.js";

    var dllearnerSrc = [
        "scripts/jquery/jquery-1.12.3.min.js",
        "scripts/angular/angular.min.js",
        "scripts/lib/AJAXModule.js",
        "scripts/lib/DLLearnerModules.js",
        "scripts/lib/DLLearner.js",
        "scripts/lib/ToolboxCtrl.js",
        "scripts/lib/CodeMirror/lib/codemirror.js",
        "scripts/lib/CodeMirror/mode/ebnf/ebnf.js",
        "scripts/lib/CodeMirror/mode/xml/xml.js",
        "scripts/lib/CodeMirror/addon/scroll/simplescrollbars.js"
    ];
    var dllearnerDest = "./build/" + concatName;

    var includeRegex = /DLLearner-\d+\.\d+\.\d+(\.\d+)*(\.min)*\.js/;
    var includeReplace = "<%= pkg.name %>-<%= pkg.version %>.js";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            dllearner: {
                files: dllearnerSrc,
                tasks: ['clean:build', 'concat:dllearner', 'replace:dllearner']
            }
        },
        clean: {
            build: ['./build']
        },
        concat: {
            options: {
                separator: ';',
            },
            dllearner: {
                src: dllearnerSrc,
                dest: dllearnerDest
            }
        },
        replace: {
            dllearner: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: includeRegex,
                        replacement: includeReplace
                    }]
                },
                files: [{
                    src: './views/index.html',
                    dest: './views/index.html'
                }]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'concat', 'replace', 'watch']);
};
