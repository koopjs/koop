const fs = require('fs');
const { Readable } = require('stream');
const spawn = require('await-spawn');
const execute = require('../gh-release');

jest.mock('await-spawn');

describe('GitHub releases', () => {
  beforeEach(() => {
    spawn.mockReset();
    jest
      .spyOn(fs, 'createReadStream')
      .mockImplementation(() =>
        Readable.from(['## 1.2.3\n', '\n', 'Release notes\n', '\n', '## 1.2.2\n']),
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('creates releases only for tags on the release commit', async () => {
    spawn
      .mockResolvedValueOnce(Buffer.from('@koopjs/koop-core@1.2.3\n'))
      .mockResolvedValueOnce(Buffer.from(''))
      .mockResolvedValueOnce(Buffer.from('release URL'));

    await execute();

    expect(spawn).toHaveBeenNthCalledWith(1, 'git', ['tag', '--points-at', 'HEAD']);
    expect(spawn).toHaveBeenNthCalledWith(2, 'gh', [
      'api',
      '--paginate',
      'repos/{owner}/{repo}/releases',
      '--jq',
      '.[].tag_name',
    ]);
    expect(fs.createReadStream).toHaveBeenCalledWith('packages/core/CHANGELOG.md');
    expect(spawn).toHaveBeenNthCalledWith(3, 'gh', [
      'release',
      'create',
      '@koopjs/koop-core@1.2.3',
      '--target',
      'master',
      '--notes',
      '## 1.2.3\nRelease notes',
    ]);
  });

  test('skips existing releases when retrying a partially successful job', async () => {
    spawn
      .mockResolvedValueOnce(Buffer.from('@koopjs/koop-core@1.2.3\n@koopjs/logger@1.2.3\n'))
      .mockResolvedValueOnce(Buffer.from('@koopjs/koop-core@1.2.3\n'))
      .mockResolvedValueOnce(Buffer.from('release URL'));

    await execute();

    expect(fs.createReadStream).toHaveBeenCalledTimes(1);
    expect(fs.createReadStream).toHaveBeenCalledWith('packages/logger/CHANGELOG.md');
    expect(spawn.mock.calls[2][1]).toContain('@koopjs/logger@1.2.3');
  });

  test('succeeds without creating anything when all releases already exist', async () => {
    spawn
      .mockResolvedValueOnce(Buffer.from('@koopjs/logger@1.2.3\n'))
      .mockResolvedValueOnce(Buffer.from('@koopjs/logger@1.2.3\n'));

    await execute();

    expect(fs.createReadStream).not.toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledTimes(2);
  });

  test('handles a commit with no tags', async () => {
    spawn.mockResolvedValueOnce(Buffer.from('')).mockResolvedValueOnce(Buffer.from(''));

    await execute();

    expect(fs.createReadStream).not.toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledTimes(2);
  });

  test('propagates tag lookup failures', async () => {
    spawn.mockRejectedValueOnce({ stderr: Buffer.from('git failed') });

    await expect(execute()).rejects.toThrow('git failed');
    expect(spawn).toHaveBeenCalledTimes(1);
  });

  test('propagates release lookup failures rather than trying to create duplicates', async () => {
    spawn
      .mockResolvedValueOnce(Buffer.from('@koopjs/logger@1.2.3\n'))
      .mockRejectedValueOnce({ stderr: Buffer.from('API unavailable') });

    await expect(execute()).rejects.toThrow('API unavailable');
    expect(fs.createReadStream).not.toHaveBeenCalled();
  });

  test('propagates release creation failures so the job can be retried', async () => {
    spawn
      .mockResolvedValueOnce(Buffer.from('@koopjs/logger@1.2.3\n'))
      .mockResolvedValueOnce(Buffer.from(''))
      .mockRejectedValueOnce({ stderr: Buffer.from('creation failed') });

    await expect(execute()).rejects.toThrow('creation failed');
  });
});
