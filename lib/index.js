const log = require('./logging');
const steps = require('./steps');
const pkg = require('./package');

const create = () => {

  const PACKAGE_JSON = './package.json';
  const DEFAULT_RELEASE = ['checkStatus', 'test', 'setReleaseVersion', 'commitReleaseVersion', 'tagRelease', 'publish',
    'setNextVersion', 'commitNextVersion', 'pushChanges'];

  const run = (options) => {

    log.info('Starting release\n');
    return pkg.getSteps(PACKAGE_JSON)
       .then(releaseSteps => releaseSteps.length > 0 ? releaseSteps: DEFAULT_RELEASE)
       .then(steps.getFlow)
       .then(flow => {
          return flow.reduce(
            (promise, step) => promise.then(result => step(options).then(Array.prototype.concat.bind(result))),
            Promise.resolve([]));
       })
       .then(() => log.success('Completed release.'))
       .catch(err => {
         log.error(err);
         return Promise.reject(new Error('Release failed.'))
       });
  };

  return {
    run
  };
};

module.exports = {
  create
};
