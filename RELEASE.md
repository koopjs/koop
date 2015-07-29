# Koop Release Process

## 1. Contribute

- Check issues
- Write documentation
- Write tests
- Fix bugs
- Refactor code
- Add new features as needed

## 2. Review

- Should have a human-readable change log update under an `Unreleased` heading
- Be wary of breaking changes -- WWSVD? (Would Would [SemVer](http://semver.org/) Do?)
- New functions should have tests and doc (using [jsdoc](http://usejsdoc.org))
- All tests should pass

## 3. Merge

- Only merge to master if it's ready to go out with the next release
  - All patch and minor updates are fine to merge to master
  - Major updates (breaking changes) should be merged to a separate major branch
- Use `[DNM]` (Do Not Merge) in the PR title to indicate more changes are pending

## 4. Prepare

- Is this a patch, minor, or major release?
- Are all tests passing?
- Is the change log up to date?

## 5. Bump

- One commit should handle the version bump
- Commit message format: `:package: X.Y.Z`
- Bump in `package.json` and `CHANGELOG.md`
- Version number in `CHANGELOG.md` should have a compare link for diff from last version
  - Example: https://github.com/koopjs/koop/compare/v2.5.1...v2.5.2

## 6. Release

- Create a release on github using [`gh-release`](https://github.com/ngoldman/gh-release)
- Verify that everything looks okay (you can undo a release on github, but not on npm)
- Run `npm publish`

## GOTO 1
