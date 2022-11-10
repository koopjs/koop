const { default: { getDependencyReleaseLine } } = require('@changesets/changelog-git');

const getReleaseLine = async (changeset) => {
  return changeset.summary;
};


module.exports = { getDependencyReleaseLine, getReleaseLine };
