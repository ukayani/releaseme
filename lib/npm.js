const shell = require('shelljs');
const escape = require('any-shell-escape');

const exec = (command) => {
  const cmd = escape(['npm', 'run', command]);
  return new Promise((resolve, reject) => {
    shell.exec(cmd, (code, stdout, stderr) => {
      if (code !== 0) return reject(new Error(stderr));
      return resolve(stdout);
    });
  });
};

module.exports = {
  exec
};
