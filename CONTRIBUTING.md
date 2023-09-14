# Contributing
Pull requests are welcomed and encouraged. If you find a bug or need an enhancement, first check for any open issues. If nothing matches, open an issue. Solicit some feedback about your planned PR.  Maybe we can help with some guidance or context. If you decide to move ahead with development work, let us know with an issue comment

Please consider the following PR guidelines:
1. Provide a clear description of what the PR is trying to solve.  Link to any existing issues.
2. Aim for clear, readable code.
3. Use conventional commit messages. There is tool in place that won't allow commit that don't adhere to this format. For convenience, you can add commits with `npm run commit`.
3. Add unit tests and ensure any new code has 100% test coverage. You can do this by running `npm run test:cov` and then looking for your file in the `/coverage/index.html` output.
4. Run `npm run lint:fix` and ensure you're not commiting lint
5. If your new code requires a release, please run `npm run changeset:add` and commit the generated changeset file as a part of your PR.

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).