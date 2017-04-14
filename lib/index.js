const log = require('./logging');
const stages = require('./stages');

const create = () => {

  const run = (options) => {

    const flow = [stages.status, stages.lint, stages.test, stages.bump, stages.commit, stages.tag, stages.snapshot,
      stages.commit, stages.push];

    const serial = stages =>
      stages.reduce((promise, stage) =>
        promise.then(result => stage(options).then(Array.prototype.concat.bind(result))), Promise.resolve([]));

    return serial(flow)
      .then(() => log.success('Completed release.'));
  };

  return {
    run
  };
};

module.exports = {
  create
};
