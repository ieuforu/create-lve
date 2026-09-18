# Releasing create-lve

Publishing uses npm Trusted Publishing (OIDC), so the repository does not need a long-lived npm token.

## One-time npm setup

On npmjs.com, open the `create-lve` package settings and add a GitHub Actions trusted publisher with:

- Organization or user: `ieuforu`
- Repository: `create-lve`
- Workflow filename: `publish.yml`
- Environment: leave empty

## Publish a version

Commit the changes you want to release, leave the working tree clean, and run one command:

```bash
pnpm release:patch
```

Use `pnpm release:minor` or `pnpm release:major` for larger version changes.

The release command:

1. Verifies that the current branch is `main`, the working tree is clean, and the branch is not behind `origin/main`.
2. Runs `pnpm check` and `pnpm test:smoke`.
3. Updates the package version and creates the release commit and tag.
4. Pushes `main` and the new tag.

The pushed tag starts the publish workflow. A read-only job verifies that the tag and package version match, rebuilds both generated templates, and runs their tests. Only after that succeeds does a separate job receive the short-lived npm publishing credential, publish the package, and create a GitHub Release. npm adds a provenance attestation automatically for public packages published with trusted publishing.

If publishing fails after a tag was pushed, run the `Publish to npm` workflow manually and enter the existing tag, such as `v0.6.64`. The workflow is safe to retry when the npm package or GitHub Release already exists.
