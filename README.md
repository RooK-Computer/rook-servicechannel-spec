# RooK Service Channel Specification

This repository contains the specification and planning artifacts for the RooK remote support service channel.

The goal of the system is to enable temporary remote support sessions for RooK consoles. A user activates support locally on the console, establishes a temporary network connection, receives a short-lived PIN, and a RooK support employee can then open a browser-based terminal session for exactly that console.

This repository does not contain implementation code. It is a specification workspace for interface planning, OpenAPI drafts, supporting schemas, and state or error models.

## Repository Purpose

The repository captures the contract-first design work for the interfaces involved in the RooK service channel:

- Console UI to local agent
- Console agent to backend
- Web frontend to backend
- Browser to terminal gateway
- Terminal gateway to console
- Backend to terminal gateway grant validation

The artifacts are intended to support future implementation work without forcing undocumented assumptions.

## Repository Structure

- `docs/architecture/`
  - Architecture and concept documents that define the overall system and support flow
- `plans/`
  - Numbered specification plans that allow follow-up work to continue even after a context reset
- `openapi/`
  - OpenAPI draft specifications for HTTP APIs and structured contract drafts for non-HTTP interfaces
- `schemas/`
  - Supporting protocol and domain catalogs grouped by interface area
- `models/`
  - Supporting state, event, and error documents used by the interface drafts
- `scripts/`
  - Build scripts for generating the GitHub Pages documentation site
- `site-assets/`
  - Static assets used by the generated documentation portal
- `.github/workflows/`
  - GitHub Actions workflow for building and deploying the documentation site to GitHub Pages

## Current Status

All currently identified interface plans have been created and elaborated to the point where the remaining open points are intentionally limited to implementation-driven details.

The plan status `Wartet auf Implementierungserkenntnisse` is used when a specification area is mature enough for now and should only be refined further once implementation reveals concrete payload, error, or lifecycle details.

## Working Rules

The repository follows a strict rule for specification work:

- no additional assumptions should be introduced silently
- missing or ambiguous details must be turned into explicit follow-up questions
- answers to those questions must be written back into the affected plans and draft artifacts

This is important because the repository is meant to preserve a reliable planning trail for future work.

## Language Note

Most documents in this repository are written in German.

That is intentional. The first target rollout and operational usage are centered on Germany, so the planning material is currently optimized for the primary working context of the project team.

The repository can still be hosted publicly on GitHub, but the documentation language reflects the current product and rollout focus rather than a generic international audience.

## Primary Source Document

The main architectural starting point is:

- `docs/architecture/servicechannel-concept.md`

## GitHub Pages Documentation Site

The repository is prepared for publication as a GitHub Pages site.

The setup includes:

- static HTML rendering for the published specification Markdown documents in `docs/`, `schemas/`, and `models/`
- a standalone interactive viewer for every OpenAPI draft in `openapi/`
- a generated portal index that links the published specification documents and viewers
- a GitHub Actions workflow that builds and deploys the site to GitHub Pages

Internal planning documents under `plans/` are intentionally excluded from the published Pages output.

For non-HTTP drafts that intentionally do not define `paths`, the generated site uses a structured schema-oriented contract page instead of a mostly empty Redoc view.

### Local build

```bash
npm install
npm run build:pages
```

The generated site is written to `dist/`.

### Local preview

```bash
npm run preview:pages
```

This builds the site and starts a local preview server at `http://localhost:4173`.

If you already built the site and only want to serve the current `dist/` output, use:

```bash
npm run serve:pages
```

You can override the port via `PORT`, for example `PORT=8080 npm run preview:pages`.

### GitHub deployment

The workflow file `.github/workflows/deploy-pages.yml` is already included.

After pushing the repository, the remaining GitHub-side step is to enable GitHub Pages for the repository and select GitHub Actions as the deployment source.

## Next Steps

Typical next steps for future work in this repository are:

- refine draft payload models once implementation starts
- define concrete error code catalogs from real failure scenarios
- promote draft OpenAPI files to stable contract versions
- keep plans, schemas, and models synchronized when new technical decisions are made
