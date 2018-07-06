const _ = require('lodash');

const filterNullValues = (array) => {
  return _.filter(array, (item) => item !== null);
}

module.exports = {
  filterNullValues,
}
