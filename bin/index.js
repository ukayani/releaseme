#!/usr/bin/env node

'use strict';
const pkg = require('../package.json');
const assert = require('assert');
const program = require('commander');
const chalk = require('chalk');
const releaseme = require('../lib');

const showHelp = () => {
  program.outputHelp(chalk.blue);
};

function exitIfFailed(fn) {
  const args = Array.prototype.slice.call(arguments, 1);
  try {
    return fn.apply(null, args);
  } catch (err) {
    console.error(chalk.red(err.message));
    showHelp();
    process.exit(1);
  }
}

const exitOnFailedPromise = (promise) => promise.catch(err => {
  console.error(chalk.red(err.message));
  process.exit(1);
});

const createClient = () => {
  return releaseme.create();
};

const run = (client, program) => {

  const type = program.args.length ? program.args[0] : 'patch';

  const options = {
    type,
    nextVersion: program.nextVersion,
    currentVersion: program.currentVersion
  };

  const validate = () => {
    const isValidRelease = ['major', 'minor', 'patch'].indexOf(options.type.toLocaleLowerCase()) > -1;
    assert(isValidRelease, 'Must provide release type');
  };

  exitIfFailed(validate);

  return client.run(options);
};

program
  .version(pkg.version)
  .option('-c, --current-version <version>', 'The version to release')
  .option('-n, --next-version <version>', 'The next version for release')
  .usage('[options] [type]')
  .description('Releases your node module. Use [type] to specify: [major, minor, patch]');

program.parse(process.argv);


const client = createClient();
exitOnFailedPromise(run(client, program));
