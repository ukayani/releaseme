const log = require('./logging');
const steps = require('./steps');

const create = () => {

  const run = (options) => {

    log.info('Starting release\n');
    const flow = [steps.status, steps.test, steps.bump, steps.commit, steps.tag, steps.snapshot,
      steps.commit, steps.push];

    const serial = stages =>
      stages.reduce((promise, stage) =>
        promise.then(result => stage(options).then(Array.prototype.concat.bind(result))), Promise.resolve([]));

    return serial(flow)
      .then(() => log.success('Completed release.'))
      .catch(() => Promise.reject(new Error('Release failed.')));
  };

  return {
    run
  };
};

module.exports = {
  create
};
