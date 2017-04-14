const fs = require('./file.utils');

const get = (path) => fs.read(path, '{}').then(JSON.parse);

const getVersion = (path) => get(path).then(pkg => pkg.version);
const setVersion = (path, version) => get(path).then(pkg => {
  pkg.version = version;
  return fs.write(path, JSON.stringify(pkg, null, 4));
});

module.exports = {
  get,
  getVersion,
  setVersion
};
