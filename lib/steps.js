const git = require('./git');
const npm = require('./npm');
const pkg = require('./package');
const semver = require('semver');
const log = require('./logging');
const chalk = require('chalk');

const logStep = (step) => {
  log.info(`Running step: ${chalk.bold.white(step)}`);
};

const PACKAGE_JSON = './package.json';
const SNAPSHOT_SUFFIX = '-SNAPSHOT';
const isSnapshot = (version) => version.indexOf(SNAPSHOT_SUFFIX) > -1;
const toSnapshot = (version) => !isSnapshot(version) ? `${version}-SNAPSHOT`: version;
const nextVersion = (version, type) => isSnapshot(version) ? version.replace(SNAPSHOT_SUFFIX, ''): semver.inc(version, type);

const status = () => {
  logStep('Git Status Check');
  return git.status().then(res => res.trim().length == 0).catch(_ => false).then(status => {
    return status ? Promise.resolve(status): Promise.reject(new Error('Working directory is not clean. Please commit all changes.'));
  });
};

const npmRun = (command) => () => {
  logStep(`npm ${command}`);
  return npm.exec(command);
};

const test = npmRun('test');
const lint = npmRun('lint');

const bump = (context) => {
  logStep('Bump Version');
  const versionPromise = pkg.getVersion(PACKAGE_JSON);
  const type = context.type || 'patch';

  return versionPromise.then(version => {
    const next = nextVersion(version, type);
    log.details(`Bumping version ${version} to ${next}`);
    return pkg.setVersion(PACKAGE_JSON, next);
  });
};

const snapshot = () => {
  logStep('Snapshot Version');
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const snapshot = toSnapshot(semver.inc(version, 'patch'));
    log.details(`Setting snapshot version to ${snapshot}`);
    return pkg.setVersion(PACKAGE_JSON, snapshot);
  });
};

const commit = (context) => {
  logStep('Commit Changes');
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const message = `Setting version to ${version}`;
    return git.commit(message);
  });
};

const push = (context) => {
  logStep('Push Changes');
  return git.push();
};

const tag = (context) => {
  logStep('Tag');
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    return git.tag(`v${version}`, `Releasing ${version}`);
  });
};

module.exports = {
  status,
  test,
  lint,
  npmRun,
  bump,
  snapshot,
  commit,
  push,
  tag
};
