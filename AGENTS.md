# AGENTS.md

## Purpose of this repository

This repository is the specification home for the RooK service channel.

It does **not** contain the implementation repositories. Instead, it contains:

* architecture and concept documents,
* OpenAPI drafts,
* supporting schema catalogs,
* state, event, and error models,
* implementation status summaries and cross-team planning notes.

If you are asked to "change the project" while working here, the most likely correct action is to update the specification and planning artifacts, not to add runtime code.

## Primary entry points

Start here unless the user points elsewhere:

1. `docs/architecture/servicechannel-concept.md`
2. `implementation/00-implementierungsstatus-uebersicht.md`
3. `implementation/11-integrationsbefunde-und-folgearbeiten.md`

Then continue into the component-specific status documents as needed:

* `implementation/01-rook-ui-status.md`
* `implementation/02-rook-agent-status.md`
* `implementation/03-openvpn-infrastruktur-status.md`
* `implementation/04-rook-backend-status.md`
* `implementation/05-browser-terminal-gateway-status.md`

## Repository map

* `docs/architecture/`
  * overall architecture and system behavior
* `openapi/`
  * draft contracts for HTTP and structured interface protocols
* `schemas/`
  * protocol and domain catalogs backing the drafts
* `models/`
  * state, event, and error model documents
* `implementation/`
  * component status, cross-team planning, and integration findings
* `plans/`
  * numbered spec-planning documents that explain how draft artifacts were derived

## Working style for this repo

This repository is contract-first and deliberately conservative.

Follow these rules:

* Do not silently invent behavior that is not grounded in the concept, an explicit clarification, or a clearly documented new decision.
* If a test finding reveals missing semantics, prefer updating the relevant concept, OpenAPI, schema, and state documents together.
* If a finding is only product/UI work and does not change contracts, keep it in `implementation/` status and findings documents instead of forcing it into API specs.
* Keep cross-team visibility high: central findings go into `implementation/11-integrationsbefunde-und-folgearbeiten.md`, while team-local consequences should also be mirrored in the affected component status files.

## Current important context

The repository has already been updated with findings from the first interactive integration tests.

Important current decisions already documented:

* Agent heartbeats keep the support session open.
* A support session does not require a continuously active service employee.
* Browser terminal inactivity alone must not end the browser terminal session.
* A real browser disconnect ends the browser terminal session, but not automatically the higher-level support session.
* Browser-facing team UI is now intended to use React with TypeScript.
* The current desired team UI layout is a vertical two-block layout:
  * controls first,
  * terminal below in a full-width 4:3 area,
  * debug information behind a clickable info icon,
  * terminal height limited so the full terminal remains visible within the available viewport, accounting for Drupal UI chrome.
* Backend menu placement currently desired:
  * team UI in the main navigation, preferably near the top,
  * configuration entry under Drupal `Configuration/System`.

## How to update documents consistently

When behavior changes, usually check whether updates are needed in more than one place:

* concept:
  * `docs/architecture/servicechannel-concept.md`
* contract draft:
  * relevant file in `openapi/`
* supporting domain/protocol catalog:
  * relevant file in `schemas/`
* state/event/error semantics:
  * relevant file in `models/`
* cross-team impact:
  * `implementation/11-integrationsbefunde-und-folgearbeiten.md`
* component-level consequences:
  * relevant file in `implementation/0x-...-status.md`

If you only update one layer for a cross-cutting lifecycle change, you probably have not finished the job.

## Language

Most repo content is in German, even if some root-level documents are in English.

Prefer preserving the language already used by the file you edit:

* German for most architecture, implementation, schema, and model documents
* English only where an existing root document already uses English

## Practical guidance for future agents

Before making changes:

* read the current status and findings documents, not only the main concept
* check whether a supposed "open issue" was already clarified in a newer artifact
* watch for outdated summary documents and bring them in line with the more detailed component documents

When asked to structure work for multiple teams:

* prefer a hybrid approach:
  * central cross-team findings document,
  * mirrored consequences in component status files

When a user still has product details in mind:

* ask first before documenting layout, navigation, or UX decisions
* only promote UI choices into concept-level docs when they are meant to become stable project direction
