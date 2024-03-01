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
  const output = await execCommandLine('git', ['tag', '--contains', 'HEAD^']);
  return output.trimEnd().split('\n');
}

async function getChangelogEntry(tag) {
  const {
    groups: { package },
  } = TAG_REGEX.exec(tag);

  const packageDir = package === 'koop-core' ? 'core' : package;

  return new Promise((resolve, rejects) => {
    // @TODO: make this safe for packages without an existing changelog.
    const readStream = fs.createReadStream(
      `packages/${packageDir}/CHANGELOG.md`,
    );
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
  const promises = tags.map((tag) => {
    return getChangelogEntry(tag);
  });
  const results = await Promise.all(promises);

  const releasePromises = results.map(([tag, changelog]) => {
    return createRelease(tag, changelog);
  });

  return Promise.all(releasePromises);
}

execute()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
