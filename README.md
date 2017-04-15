# Releaseme

A release tool inspired by [sbt-release](https://github.com/sbt/sbt-release) for node projects.

# How it works

A typical release process involves running tests, updating project version, tagging the release and publishing the artifact.
Although some steps in this process are common amongst projects, some projects may require a custom release process.

With `releaseme` you are able to set up a custom release process for your project using a combination of built-in steps and
custom step definitions.

The steps will execute in serial and if any step fails, the release process fails.

# Installation

```bash
$ npm install -g releaseme
```

# Usage

In the root of your project run `releaseme`.
By default, `releaseme` will increment the current project version with a `patch` increment using the [Default Release Process](#default-release-process).

You can specify the type of increment via the `type` argument with one of the following values: [`major`, `minor`, `patch`]

If you wish to specify the exact release version you can do so via the `--release-version` arg.

```bash
 Usage: releaseme [options] [type]

  Releases your node module. Use [type] to specify: [major, minor, patch]

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -c, --release-version <version>  The version to release
    -n, --next-version <version>     The next version for release (snapshot)
```

# Default Release Process

The default release process involves the following steps:

1. **checkStatus** - Check if the git working directory is clean. If there are any unstaged/staged changes the process will fail.
2. **test** - Runs `npm test` on your project
3. **setReleaseVersion** - Updates the `package.json` with the release version
4. **commitReleaseVersion** - Commits the release version (package.json)
5. **tagRelease** - Creates a git annotated tag with the release version
6. **publish** - Runs `npm publish` on your project to publish your artifact to npm.
7. **setNextVersion** - Sets the next development version in `package.json` for your project with a `SNAPSHOT` suffix.
8. **commitNextVersion** - Commits this new snapshot version
9. **pushChanges** - Pushes all changes git remote origin.

# Custom Release Process

To set up a custom release process, you can define an array of steps in your `package.json` via the
`releaseme.steps` field.

You can use built-in steps listed in [Default Release](#default-release-process) or use custom steps.

### Custom Step

To set up custom steps you must define the step as a `script` in your `package.json`.
You can then use the name of the script as a step in your release.

**Example package.json with custom release with linting**

```json
{
"name": "my-module",
...
"scripts": {
        "lint": "gulp lint",
        "test": "gulp test"
    },
"releaseme": {
        "steps": [
            "checkStatus",
            "lint",
            "test",
            "setReleaseVersion",
            "commitReleaseVersion",
            "tagRelease",
            "publish",
            "setNextVersion",
            "commitNextVersion",
            "pushChanges"
        ]
},
...
}
```

The example above adds a script called lint which runs `gulp lint`. We then use this script as a step in our release steps after `checkStatus`


