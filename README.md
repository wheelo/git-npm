## git-npm-release
One batch way to publish both git and npm packages to related repositories.

## Installation
npm install -g git-npm-release

## Usage

The usage of this package is easy, just type the word `gn` in your command line (zsh, bash, iTerm and *etc.*). 
However, you can opt into using the custom options of this package by specifying concrete params. The optional fields can have:

**Default** 

When you use the command line `gn`, it will use full-blown features brought by the default configures, which include git push, git release and npm publish. In most cases, you just need to type one simple command `git-npm`. Use "git-npm" directly as shorthand for `gn --increment=increment-level --message="Release increment-level`. 

You can use the param '-i' or '--increase' to add the upgrade level. Version level can be one of: major, minor, patch, premajor, preminor, prepatch, or prerelease. Default level is 'patch'. Only one version may be specified.

**Advanced way** 

You can yet switch to DIY mode any time you want to publish a custom behaviour of publishing. In those cases, you just need explicitly append `-l` param to 'np' command. There are three modes available now for you to opt in:

- `gn -l -push (-m "comment")`： Only push (with your comment)
- `gn -l -publish`： Only npm publish
- `gn -l -release (-m "comment")`： Only release (with your comment)


Still, you can use it within the gulp environment.
Just configure it as one task of gulp, then type in command line: `gulp some-git-npm-task`

