const git = require('./git');
const npm = require('./npm');
const pkg = require('./package');
const semver = require('semver');
const log = require('./logging');

const PACKAGE_JSON = './package.json';
const SNAPSHOT_SUFFIX = '-SNAPSHOT';
const isSnapshot = (version) => version.indexOf(SNAPSHOT_SUFFIX) > -1;
const toSnapshot = (version) => !isSnapshot(version) ? `${version}-SNAPSHOT`: version;
const nextVersion = (version, type) => isSnapshot(version) ? version.replace(SNAPSHOT_SUFFIX, ''): semver.inc(version, type);

const status = () => {
  return git.status().then(res => res.trim().length == 0).catch(_ => false).then(status => {
    return status ? Promise.resolve(status): Promise.reject(new Error('Working directory is not clean. Please commit all changes.'));
  });
};

const npmRun = (command) => () => {
  log.info('Running npm ${command}');
  return npmRun.exec(command);
};

const test = npmRun('test');
const lint = npmRun('lint');

const bump = (context) => {
  const versionPromise = pkg.getVersion(PACKAGE_JSON);
  const type = context.type || 'patch';

  return versionPromise.then(version => {
    const next = nextVersion(version, type);
    log.info(`Bumping version ${version} to ${next}`);
    return pkg.setVersion(PACKAGE_JSON, next);
  });
};

const snapshot = () => {
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const snapshot = toSnapshot(semver.inc(version, 'patch'));
    log.info(`Setting snapshot version to ${snapshot}`);
    return pkg.setVersion(PACKAGE_JSON, snapshot);
  });
};

const commit = (context) => {
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const message = `Setting version to ${version}`;
    return git.commit(message);
  });
};

const push = (context) => {
  return git.push();
};

const tag = (context) => {
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
