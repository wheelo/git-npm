#!/usr/bin/env node

var release = require('../lib/git-npm'),
    args = [].slice.call(process.argv, 2);

var exitCode = 0;

release.cli(args).then(function() {
    process.exit(exitCode);
}).catch(function(err) {
    exitCode = 1;
    console.error(err);
});

process.on('exit', function() {
    process.exit(exitCode);
});
