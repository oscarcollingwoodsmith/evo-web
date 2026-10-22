---
type: dx
impact: med
effort: low
site: packages/skin/package.json › build:css
---

# Pin the required Node version so a Node 20 build cannot wipe `packages/skin/dist`

`build:css` runs `rimraf dist` before `postcss`, and `postcss` fails on Node 20 because `cssnano`'s `postcss-merge-longhand` (`src/lib/unresolved.js`) calls `Set.prototype.difference`, which only exists on Node 22+. The failed build leaves every tracked file under `packages/skin/dist` deleted, so the next `git status`/pre-push hook reports hundreds of dirty files and the push is refused with no hint that the Node version was the cause. Nothing in the repo guards against this: there is no root `engines` field or `.nvmrc`, so `nvm`/`npm` happily run the hooks on Node 20 even though `ci.yml` pins Node 24. Add `engines.node` (with `engine-strict` in `.npmrc`) and/or a `.nvmrc`, or move `rimraf dist` after the plugins have loaded, so the failure is a clear version error rather than a wiped `dist`. Observed in `skin`; the pre-commit/pre-push hooks inherit it for every package.

Check: `source ~/.nvm/nvm.sh && nvm use 20 && npm run build -w packages/skin` fails with `TypeError: trustedFunctions.difference is not a function`, and `git status --porcelain packages/skin/dist | wc -l` is non-zero afterwards. Same command on Node 24 passes and leaves the tree clean.
