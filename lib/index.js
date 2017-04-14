const utils = require('./file.utils');
const log = require('./logging');
const git = require('./git');

const create = () => {

  const run = (options) => {
    console.log(options);
    return git.commit('added some git commands').then(() => git.push());
  };
  return {
    run
  };
};

module.exports = {
  create
};
