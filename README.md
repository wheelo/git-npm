# git-npm
One batch way to publish both git and npm packages to related repositories.

## Installation
npm install -g git-npm-release

## Usage

The usage of this package is easy, just type the word `gn` in your command line (zsh, bash, iTerm and *etc.*). 
However, you can opt into using the custom options by specifying concrete params. Different options have the differed usage.

**Simple Mode** 

When you use the command line `gn`, it will use full-blown features brought by the default configures, which include git push, git release and npm publish. In most cases, you just need to type one simple command `git-npm`. Use `gn` directly as shorthand for `gn -i patch -m "Release upgraded-version`. 

You can use the param '-i' or '--increase' to bump the version. The version level can be one of: major, minor, patch, premajor, preminor, prepatch, or prerelease. Default level is 'patch'. Only one version may be specified.

**Advanced Mode** 

You can yet switch to DIY mode any time you want to publish a custom behaviour of publishing. In those cases, you just need explicitly append `-l` param to 'np' command. There are three modes available now for you to opt in:

- `gn -l -p (-m "comment")`： Only push (with your comment)
- `gn -l -P`： Only npm publish
- `gn -l -r (-m "comment")`： Only release (with your comment)

**Gulp Connect Mode**

Finally, you can use this package in gulp environment.
Just configure it as one task of gulp, then type in command line: 

`gulp some-git-npm-task`



