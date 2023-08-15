const _ = require('lodash');

module.exports = function join () {
  const path = _.chain(arguments)
    .values()
    .filter(fragment => {
      return !_.isEmpty(fragment) || fragment === '/';
    }).map(fragment => {
      return fragment
        .split('/')
        .filter(fragment => fragment !== '');
    })
    .flatten()
    .join('/')
    .value();
  
  return `/${path}`;
};
