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

const tag = (tag, message) => {
  const command = escape(['git', 'tag', '-a', tag, '-m', message]);
  return exec(command);
};

//const isClean = status().then(res => res.trim().length == 0).catch(_ => false);

module.exports = {
  status,
  commit,
  push,
  tag
};
