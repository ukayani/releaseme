const fs = require('./file.utils');

const get = (path) => fs.read(path, '{}').then(JSON.parse);

const getVersion = (path) => get(path).then(pkg => pkg.version);
const setVersion = (path, version) => get(path).then(pkg => {
  pkg.version = version;
  return fs.write(path, JSON.stringify(pkg, null, 4));
});

const getScripts = (path) => get(path).then(pkg => pkg.scripts);
const getSteps = (path) => get(path).then(pkg => {
  const releaseme = pkg.releaseme || {};
  return releaseme.steps || [];
});

const getReleaseTagPrefix = (path) => get(path).then(pkg => {
  const releaseme = pkg.releaseme || {};
  return releaseme.tagPrefix || '';
});

module.exports = {
  getScripts,
  getSteps,
  getVersion,
  setVersion,
  getReleaseTagPrefix
};
