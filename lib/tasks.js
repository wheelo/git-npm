var _ = require('lodash'),
    shell = require('./shell'),
    log = require('./log'),
    git = require('./git'),
    when = require('when'),
    util = require('./util'),
    sequence = require('when/sequence'),
    noop = when.resolve.bind(when, true);

function parseVersion(options) {

    var version = util.isValidVersion(options.increment) ? options.increment : options.npm.version;

    if(!version) {

        return git.getLatestTag().then(function(tag) {
            if(tag) {
                var nextVersion = util.increment(tag, options.increment, options.prereleaseId);
                log.bold(util.format('Latest tag: %s. Next version: %s', tag, nextVersion));
                options.version = nextVersion;
                return options;
            } else {
                throw new Error('Error detecting current version from latest tag.');
            }
        }).catch(function(err) {
            console.log(err);
            throw new Error('No version provided. Please provide version argument, or make sure there is a tag to derive it from.');
        });

    } else {
        options.prevVersion = version;
        options.version = util.increment(version, options.increment, options.prereleaseId);
        return options;
    }
}

function getRemoteGitUrl(options) {
    return git.getRemoteUrl().then(function(remoteUrl) {
        options.remoteUrl = remoteUrl;
        return options;
    }).catch(function(err) {
        throw new Error('Unable to get remote Git url.')
    });
}

function getChangelog(options) {
    if(options.github.release) {
        return git.getChangelog(options);
    } else {
        return options;
    }
}

function checkGithubToken(options) {
    if(options.github.release) {
        var token = git.getGithubToken(options.github.tokenRef);
        if(!token) {
            throw new Error('About to release to GitHub, but ' + options.github.tokenRef + ' environment variable not set');
        }
    }
    return options;
}


// options.commitMessage
function releaseSourceRepo(options) {

    log.bold('Release source repo');

    var repo = getSrcRepoTasks(options);

    var executeTasks = [
        // repo.beforeStartCommand, // todo
        repo.isRepo,
        repo.checkClean,
        repo.bump,
        repo.mkCleanDir,
        repo.beforeStageCommand,
        // repo.buildCommand, todo
        // repo.stage,
        //repo.stageDir,
        repo.addAll,
        repo.hasChanges
    ];


    executeTasks.push( 
        repo.commit,
        repo.tag,
        repo.push,
        repo.pushTags,
        repo.release,
        repo.publish
    )

    //executeTasks.push(repo.afterReleaseCommand);
    return sequence(executeTasks);
}



function getGenericTasks(options) {
    options.commitMessage = options.commitMessage || ('Release ' + options.version);
    return {
        isRepo: git.isGitRepo,
        status: git.status,
        stageDir: git.stageDir,
        // 如果有用户自定义commitMessage;否则Release -v
        commit: git.commit.bind(null, '.', options.commitMessage),
        tag: git.tag.bind(null, options.version, options.tagName, options.tagAnnotation),
        push: git.push.bind(null, options.remoteUrl),
        pushTags: git.pushTags.bind(null, options.version),
        popd: shell.popd
    }
}

function getSrcRepoTasks(options) {

    var isMakeBaseDir = options.buildCommand && options.dist.repo && options.dist.baseDir,
        // isStageBuildDir = !!options.buildCommand && !options.dist.repo && options.dist.baseDir,
        isPublish = true;

    return _.extend({}, getGenericTasks(options), {
        mkCleanDir: isMakeBaseDir ? shell.mkCleanDir.bind(null, options.dist.baseDir) : noop,
        buildCommand: shell.build.bind(null, options.buildCommand),
        beforeStartCommand: options.src.beforeStartCommand ? shell.run.bind(null, options.src.beforeStartCommand) : noop,
        checkClean: git.isWorkingDirClean.bind(null, options.requireCleanWorkingDir),
        bump: shell.bump.bind(null, options.pkgFiles, options.version),
        beforeStageCommand: options.src.beforeStageCommand ? shell.run.bind(null, options.src.beforeStageCommand) : noop,
        //stage: git.stage.bind(null, options.pkgFiles),
        //stageDir: isStageBuildDir ? git.stageDir.bind(null, options.dist.baseDir) : noop,
        addAll: git.addAll.bind(null, '.'),
        hasChanges: git.hasChanges.bind(null, 'src'),
        // I will add some hooks for git publishing (include git add.)
        push: git.push.bind(null, options.remoteUrl, options.src.pushRepo),
        pushTags: git.pushTags.bind(null, options.version, options.src.pushRepo),
        release: options.github.release ? git.release.bind(null, options, options.remoteUrl) : noop,
        publish: isPublish ? shell.npmPublish.bind(null, options.npm.publishPath, options.npm.tag) : noop,
        //afterReleaseCommand: options.src.afterReleaseCommand ? shell.run.bind(null, options.src.afterReleaseCommand) : noop
    });
}


function parseLenth(options) {
    if (!options.len) return;

    var repo = getSrcRepoTasks(options);

    var executeTasks = [];

    // -l -push : git push
    if (options.push) {
        executeTasks.push(
            repo.isRepo,
            repo.addAll,
            repo.hasChanges,
            repo.push
        )
    }

    // -l release : git tag && publish
    if (options.release) {
        executeTasks.push(
            repo.pushTags,
            repo.release
        )
    }

    // -l release : npm  publish
    if (options.pub) {
        executeTasks.push(repo.publish)
    }

    return sequence(executeTasks);
    
}

// function tmp() {
//     console.log('todo. In development')
// }

module.exports = {
    chooses: function(options) {
        return sequence([
            parseLenth
        ], options);
    },

    run: function(options) {
        return sequence([
            parseVersion,
            getRemoteGitUrl,
            getChangelog,
            checkGithubToken,
            releaseSourceRepo
        ], options)
    }
};
