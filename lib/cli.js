var parseArgs = require('minimist'),
    log = require('./log'),
    pkg = require('../package.json'),
    version = pkg.version;

// 默认-n
var helpText = [
    'gn v' + version,
    '',
    'Usage: gn <increment> [options]',
    '',
    'Use e.g. "gn" directly as shorthand for "git-npm --increment=0.0.1 --message="Release n-version".',
    '',
    '-c --config            Path to local configuration options [default: ".release.json"]',
    '-l --length            Switch to the custom mode',
    // '-d --dry-run           Do not touch or write anything, but show the commands and interactivity',
    // '-e --debug             Output exceptions',
    // '-f --force             Allow empty Git commit, force tag.',
    '-g --github.release    Release to GitHub',
    '-h --help              Print this help',
    '-i --increment         Increment "major", "minor", "patch", or "pre*" version; or specify version [default: "patch"]',
    '-m --message           Commit message [default: "Release %s"]',
    // '-n --non-interactive   No interaction (assume default answers to questions)',
    '   --prereleaseId      Identifier for pre-releases (e.g. "beta" in "1.0.0-beta.1")',
    '-p --npm.publish       Auto-publish to npm (only relevant in --non-interactive mode)',
    '   --npm.tag           Registers published package with given tag (default: "latest")',
    '-v --version           Print version number',
    '-V --verbose           Verbose output'
].join('\n');

var aliases = {
    c: 'config',
    // d: 'dry-run',
    // e: 'debug',
    f: 'force',
    g: 'github.release',
    h: 'help',
    i: 'increment',
    l: 'length',
    m: 'message',
    n: 'non-interactive',
    p: 'npm.publish',
    v: 'version',
    V: 'verbose'
};

module.exports = {
    version: function() {
        log.log('v' + version);
    },
    help: function() {
        log.log(helpText);

    },
    parse: function(argv) {
        var options = parseArgs(argv, {
            boolean: true,
            alias: aliases
        });
        options.increment = options.i = (options._[0] || options.i);
        options.commitMessage = options.message;
        return options;
    }
};
