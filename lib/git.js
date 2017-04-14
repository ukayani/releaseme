const shell = require('shelljs');
const escape = require('any-shell-escape');

const exec = (command) => {
  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (code !== 0) return reject(stderr);
      return resolve(stdout);
    });
  });
};

const status = () => {
  const command = escape(['git', 'status', '--porcelain']);
  return exec(command);
};

const commit = (message) => {
  const command = escape(['git', 'commit', '-am', message]);
  return exec(command);
};

const push = (branch) => {
  const command = escape(['git', 'push', '--follow-tags', 'origin', branch || 'master']);
  return exec(command);
};

module.exports = {
  status,
  commit,
  push
};