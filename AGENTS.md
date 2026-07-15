# AGENTS.md

This file provides guidance to AI agents when working with docs in this repository.

## What this is

The official ObjectBox documentation for the Java/Kotlin, Dart/Flutter, and Python SDKs.
It is published at docs.objectbox.io via GitBook.
It is a pure Markdown content repository — there is no build system, test suite, or linter.
C++, Go and Swift docs live in separate repositories (but may be merged in the future).

## Branch model

- `gitbook` is the live branch: GitBook Git Sync pushes web edits here as commits prefixed `GITBOOK-<n>:`,
  and local commits pushed here go live. Work on this branch.
- `main` lags behind `gitbook` and is not the publishing branch, despite being the default.
- `mdx` is an experimental conversion of the docs to MDX.

Local commits use the style `<file>.md: <what changed>` (e.g. `queries.md: add TypeScript`);
the `GITBOOK-<n>:` prefix is only added by GitBook's sync.

## Structure

- `SUMMARY.md` is the table of contents that defines the sidebar; a new page must be added there to appear in the docs.
  It also links external pages (API references, C++/Swift docs).
- Top-level `.md` files are the main pages; `android/` and `advanced/` hold subpages,
  each with a `README.md` as section index.
- Images and downloadable files go in `.gitbook/assets/`.

## GitBook Markdown conventions

Pages use GitBook-flavored Markdown, not plain Markdown:

- YAML frontmatter with a `description:` used for SEO.
- Language-specific content goes in `{% tabs %}` / `{% tab title="Java" %}` blocks.
  Tab titles and order are consistent across pages: Java, Kotlin, Dart, then Python/TypeScript where applicable.
  When editing an example, check the other language tabs of the same section for needed parallel updates.
- Callouts: `{% hint style="info" %}` (also `warning`, `success`).
- Code blocks with a file name: `{% code title="build.gradle.kts" %}` around the fenced block.
- Page cross-reference cards: `{% content-ref url="page.md" %}`.

## Other conventions

- Add newlines after sentences for better git history.
  For sentences longer than 120 chars, add newline on other punctuation marks.
- Do not add information about yourself in commits.
