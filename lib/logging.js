const chalk = require('chalk');

const logInfo = (message) => {
  console.log(chalk.blue(message));
};

const logDetails = (message) => {
  console.log(chalk.grey(message));
};

const logSuccess = (message) => {
  console.log(chalk.green(message));
};

const logError = (error) => {
  console.error(chalk.red(error.message));
};

module.exports = {
  info: logInfo,
  details: logDetails,
  success: logSuccess,
  error: logError
};
