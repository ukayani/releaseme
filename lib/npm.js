const shell = require('shelljs');
const escape = require('any-shell-escape');

const exec = (command) => {
  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (code !== 0) return reject(new Error(stderr));
      return resolve(stdout);
    });
  });
};

const run = (cmd) => {
  const command = escape(['npm', 'run', cmd]);
  return exec(command);
};

const publish = () => {
  const command = escape(['npm', 'publish']);
  return exec(command);
};

module.exports = {
  run,
  publish
};
