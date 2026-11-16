const fs = require('fs');
const byline = require('byline');
const spawn = require('await-spawn');
const { baseBranch } = require('./.changeset/config.json');

const TAG_REGEX = /@(?<owner>.+)\/(?<package>.+)@(?<version>.+)/;
const START_REGEX = /## [0-9]+.[0-9]+.[0-9]+/;
const END_REGEX = /## [0-9]+.[0-9]+.[0-9]|^All notable changes/;

async function execCommandLine(cmd, args) {
  try {
    const bufferedListResult = await spawn(cmd, args);
    return bufferedListResult.toString();
  } catch (e) {
    throw new Error(e.stderr.toString());
  }
}

async function getTags() {
  const output = await execCommandLine('git', ['tag', '--points-at', 'HEAD']);
  return output.trimEnd().split('\n').filter(Boolean);
}

async function getExistingReleases() {
  const output = await execCommandLine('gh', [
    'api',
    '--paginate',
    'repos/{owner}/{repo}/releases',
    '--jq',
    '.[].tag_name',
  ]);
  return new Set(output.trimEnd().split('\n').filter(Boolean));
}

async function getChangelogEntry(tag) {
  const {
    groups: { package: packageName },
  } = TAG_REGEX.exec(tag);

  const packageDir = packageName === 'koop-core' ? 'core' : packageName;

  return new Promise((resolve, rejects) => {
    // @TODO: make this safe for packages without an existing changelog.
    const readStream = fs.createReadStream(`packages/${packageDir}/CHANGELOG.md`);
    const lineStream = byline(readStream);
    let changelogLines = [];
    let capture = false;
    lineStream
      .on('data', function (chunk) {
        const line = chunk.toString();
        if (!capture && START_REGEX.test(line)) {
          capture = true;
        } else if (END_REGEX.test(line)) {
          lineStream.destroy();
          resolve([tag, changelogLines.join('\n')]);
          return;
        }

        if (capture) {
          changelogLines.push(line);
        }
      })
      .on('error', function (err) {
        rejects(err);
        return;
      });
  });
}

async function createRelease(tag, description) {
  return execCommandLine('gh', [
    'release',
    'create',
    tag,
    '--target',
    baseBranch,
    '--notes',
    description,
  ]);
}

async function execute() {
  const tags = await getTags();
  const existingReleases = await getExistingReleases();
  const promises = tags
    .filter((tag) => !existingReleases.has(tag))
    .map((tag) => {
      return getChangelogEntry(tag);
    });
  const results = await Promise.all(promises);

  const releasePromises = results.map(([tag, changelog]) => {
    return createRelease(tag, changelog);
  });

  return Promise.all(releasePromises);
}

if (require.main === module) {
  execute()
    .then(() => {
      process.exitCode = 0;
    })
    .catch((error) => {
      console.log(error);
      process.exitCode = 1;
    });
}

module.exports = execute;
