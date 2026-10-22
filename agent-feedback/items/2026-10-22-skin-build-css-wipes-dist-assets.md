---
type: dx
impact: med
effort: low
site: packages/skin/package.json › "build:css"
---

# Stop `build:css` from deleting the non-CSS half of `dist/`

`build:css` runs `rimraf dist` before bundling, but `dist/svg/**`, `dist/mixins/**`, `dist/variables/**` and `dist/gh/**` are only restored by the sibling `copy` and `build:icons` scripts that `build` chains afterwards. Running `build:css` alone (the natural choice when iterating on one SCSS file) therefore leaves ~1,400 tracked files deleted in the working tree, which the pre-push hook and CI then reject as a dirty tree. Either scope the clean to the CSS outputs it owns (e.g. `rimraf "dist/**/*.css"`) or move the `rimraf dist` into `build` so the partial script is safe to run on its own. Only `skin` is affected.

Check: `npm run build:css -w packages/skin && git status --porcelain packages/skin/dist | grep -c '^ D'` prints a non-zero count.
