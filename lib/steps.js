const git = require('./git');
const npm = require('./npm');
const pkg = require('./package');
const semver = require('semver');
const log = require('./logging');
const chalk = require('chalk');

const logStep = (step) => {
  log.info(`Running step: ${chalk.bold.white(step)}`);
};

const mapError = (message) => () => Promise.reject(new Error(message));

const PACKAGE_JSON = './package.json';
const SNAPSHOT_SUFFIX = '-SNAPSHOT';
const isSnapshot = (version) => version.indexOf(SNAPSHOT_SUFFIX) > -1;
const toSnapshot = (version) => !isSnapshot(version) ? `${version}-SNAPSHOT` : version;
const nextVersion = (version, type) => isSnapshot(version) ? version.replace(SNAPSHOT_SUFFIX, '') : semver.inc(version,
  type);

const status = () => {
  logStep('Git Status Check');
  return git.status().then(res => res.trim().length == 0).catch(() => false).then(status => {
    return status ? Promise.resolve(status) : Promise.reject(
      new Error('Working directory is not clean. Please commit all changes.'));
  });
};

const npmRun = (command) => () => {
  logStep(`npm run ${command}`);
  return npm.run(command).catch(mapError(`Failed to run ${command}`));
};

const test = npmRun('test');
const lint = npmRun('lint');

const publish = () => {
  logStep('Publish');
  return npm.publish().catch(mapError('Failed to publish'));
};

const setReleaseVersion = (context) => {
  logStep('Set Release Version');
  const versionPromise = pkg.getVersion(PACKAGE_JSON);
  const type = context.type || 'patch';

  return versionPromise.then(version => {
    const next = context.releaseVersion || nextVersion(version, type);
    log.details(`Changing release version ${version} to ${next}`);
    return pkg.setVersion(PACKAGE_JSON, next);
  }).catch(mapError('Failed to set release version'));
};

const setNextVersion = (context) => {
  logStep('Set Next Version (Snapshot)');
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const snapshot = toSnapshot(context.nextVersion || semver.inc(version, 'patch'));
    log.details(`Setting next version to ${snapshot}`);
    return pkg.setVersion(PACKAGE_JSON, snapshot);
  }).catch(mapError('Failed to set next version'));
};

const commit = (subject) => () => {
  logStep(`Commit ${subject}`);
  return pkg.getVersion(PACKAGE_JSON).then(version => {
    const message = `Setting version to ${version}`;
    return git.commit(message);
  }).catch(mapError(`Failed to commit ${subject}`));
};

const push = () => {
  logStep('Push Changes');
  return git.currentBranch().then(git.push).catch(mapError('Failed to push changes'));
};

const tag = () => {
  logStep('Tag Release');
  return pkg.getReleaseTagPrefix(PACKAGE_JSON).then(prefix => {
    return pkg.getVersion(PACKAGE_JSON).then(version => {
      const tagName = `${prefix}${version}`;
      return git.tag(`${tagName}`, `Releasing ${tagName}`);
    }).catch(mapError('Failed to tag release'));
  });
};

const AVAILABLE_STEPS = {
  'checkStatus': status,
  'test': test,
  'lint': lint,
  'setReleaseVersion': setReleaseVersion,
  'commitReleaseVersion': commit('Release Version'),
  'tagRelease': tag,
  'publish': publish,
  'setNextVersion': setNextVersion,
  'commitNextVersion': commit('Next Version'),
  'pushChanges': push
};

const validateSteps = (steps) => {
  return pkg.getScripts(PACKAGE_JSON).then(scripts => {
    for (let i in steps) {
      const step = steps[i];
      if (!AVAILABLE_STEPS[step] && !scripts[step]) {
        return Promise.reject(new Error(`Invalid step: ${step}. Please check your package.json steps definition.`));
      }
    }

    return Promise.resolve(steps);
  });
};

const getStep = (step) => AVAILABLE_STEPS[step] || npmRun(step);

const getFlow = (steps) => {
  return validateSteps(steps).then(() => {
    return steps.map(getStep);
  });
};

module.exports = {
  getFlow
};
