const utils = require('./file.utils');
const log = require('./logging');
const git = require('./git');

const create = () => {

  const run = (options) => {
    console.log(options);
    return git.status().then(console.log);
  };
  return {
    run
  };
};

module.exports = {
  create
};
