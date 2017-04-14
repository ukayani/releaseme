const shell = require('shelljs');
const escape = require('any-shell-escape');

const status = () => {
  const args = escape(['git', 'status', '--porcelain']);

  return new Promise((resolve, reject) => {
    shell.exec(args, (code, stdout, stderr) => {
      if (code !== 0) return reject(stderr);
      return resolve(stdout);
    });
  });
};


module.exports = {
  status
};
