# Contributing
Pull requests are welcomed and encouraged. If you find a bug or need an enhancement, first check for any open issues. If nothing matches, open an issue. Solicit some feedback about your planned PR.  Maybe we can help with some guidance or context. If you decide to move ahead with development work, let us know with an issue comment

Please consider the following PR guidelines:
1. Provide a clear description of what the PR is trying to solve.  Link to any existing issues.
2. Aim for clear, readable code.
3. Use conventional commit messages. There is tool in place that won't allow commit that don't adhere to this format. For convenience, you can add commits with `npm run commit`.
3. Add unit tests and ensure any new code has 100% test coverage. You can do this by running `npm run test:cov` and then looking for your file in the `/coverage/index.html` output.
4. Run `npm run lint:fix` and ensure you're not commiting lint
5. If your new code requires a release, please run `npm run changeset:add` and commit the generated changeset file as a part of your PR.

## Release workflow

Pushing a changeset to `master` starts four jobs in `.github/workflows/release.yml`:

1. `setup` installs and archives dependencies, versions packages, updates changelogs and
   coverage, and pushes the release commit.
2. `release-npm` publishes from that exact commit, skips versions already on npm, and pushes
   missing version tags after publishing succeeds.
3. `release-github` uses the same commit and its tags to create GitHub releases, skipping
   releases that already exist.
4. `cleanup` updates the root `package-lock.json` on the latest `master` and commits it only
   when it changes.

For transient publishing or cleanup failures, use **Re-run failed jobs** in the existing
workflow run. Successful prerequisites, including `setup`, do not need to run again.
Avoid **Re-run all jobs**, since versioning is not repeatable. npm authentication is scoped
to the publishing job using `actions/setup-node`; no repository `.npmrc` is committed.
The release jobs restore setup's dependency artifact, preserving workspace links without
installing against the stale root lockfile. Retries require that artifact to remain available.

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).