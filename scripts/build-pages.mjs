import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';

const rootDir = process.cwd();
const outDir = path.join(rootDir, 'dist');
const assetsDir = path.join(rootDir, 'site-assets');
const markdownRoots = ['docs', 'schemas', 'models'];
const openApiRoot = 'openapi';

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

const renderer = new marked.Renderer();
renderer.link = ({ href = '', title, text }) => {
  const rewritten = rewriteMarkdownHref(href);
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${escapeHtml(rewritten)}"${titleAttr}>${text}</a>`;
};
marked.use({ renderer });

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const markdownFiles = await collectMarkdownFiles();
  const openApiFiles = await collectFiles(path.join(rootDir, openApiRoot), isOpenApiFile);

  await copyStaticAssets();
  await Promise.all(openApiFiles.map(copyOpenApiSpec));
  await Promise.all(markdownFiles.map((file) => buildMarkdownPage(markdownFiles, openApiFiles, file)));
  await Promise.all(openApiFiles.map((file) => buildOpenApiPage(markdownFiles, openApiFiles, file)));
  await buildIndexPage(markdownFiles, openApiFiles);
  await buildFallbackPage(markdownFiles, openApiFiles);
  await fs.writeFile(path.join(outDir, '.nojekyll'), '');

  console.log(`Built ${markdownFiles.length} markdown pages and ${openApiFiles.length} OpenAPI viewers into ${path.relative(rootDir, outDir)}.`);
}

async function collectMarkdownFiles() {
  const files = [];

  for (const folder of markdownRoots) {
    const folderPath = path.join(rootDir, folder);
    const folderFiles = await collectFiles(folderPath, (entry) => entry.endsWith('.md'));
    files.push(...folderFiles);
  }

  return files.sort((left, right) => toPosix(path.relative(rootDir, left)).localeCompare(toPosix(path.relative(rootDir, right))));
}

async function collectFiles(folder, predicate) {
  if (!(await exists(folder))) {
    return [];
  }

  const result = [];
  const entries = await fs.readdir(folder, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      result.push(...await collectFiles(entryPath, predicate));
      continue;
    }

    if (predicate(entry.name)) {
      result.push(entryPath);
    }
  }

  return result;
}

function isOpenApiFile(fileName) {
  return /\.openapi\.ya?ml$/i.test(fileName);
}

async function copyStaticAssets() {
  const cssSource = path.join(assetsDir, 'style.css');
  const cssTarget = path.join(outDir, 'assets', 'style.css');
  await fs.mkdir(path.dirname(cssTarget), { recursive: true });
  await fs.copyFile(cssSource, cssTarget);
}

async function copyOpenApiSpec(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const targetPath = path.join(outDir, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(filePath, targetPath);
}

async function buildMarkdownPage(markdownFiles, openApiFiles, filePath) {
  const relativeSource = toPosix(path.relative(rootDir, filePath));
  const outputPath = getMarkdownOutputPath(filePath);
  const htmlRelative = toPosix(path.relative(outDir, outputPath));
  const source = await fs.readFile(filePath, 'utf8');
  const content = marked.parse(source);
  const title = extractTitle(source, relativeSource);
  const subtitle = `Rendered from ${relativeSource}`;

  const page = renderHtmlPage({
    title,
    subtitle,
    htmlRelative,
    markdownFiles,
    openApiFiles,
    body: `<article>${content}</article>`,
  });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, page);
}

async function buildOpenApiPage(markdownFiles, openApiFiles, filePath) {
  const relativeSource = toPosix(path.relative(rootDir, filePath));
  const outputPath = getOpenApiHtmlOutputPath(filePath);
  const source = await fs.readFile(filePath, 'utf8');
  const spec = parseYaml(source) || {};
  const title = humanizeFileName(path.basename(filePath, path.extname(filePath)));
  const specHref = relativeHref(outputPath, path.join(outDir, relativeSource));
  const page = hasDocumentedPaths(spec)
    ? renderOpenApiStandalonePage({ title, relativeSource, specHref, outputPath })
    : renderSchemaContractPage({ title, relativeSource, specHref, outputPath, spec });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, page);
}

async function buildIndexPage(markdownFiles, openApiFiles) {
  const outputPath = path.join(outDir, 'index.html');
  const htmlRelative = 'index.html';

  const groups = [
    { label: 'Architecture', description: 'Concept documents and system background.', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('docs/')) },
    { label: 'Schemas', description: 'Interface catalogs and supporting message definitions.', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('schemas/')) },
    { label: 'Models', description: 'State, event, and error companion documents.', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('models/')) },
  ];

  const body = `
    <section class="hero">
      <p class="eyebrow">RooK Service Channel</p>
      <h1>Published Specification Portal</h1>
      <p>
        This site publishes the actual specification corpus as static HTML and exposes every OpenAPI draft through a dedicated full-page viewer.
        Internal planning artifacts are intentionally excluded so the portal stays focused on the resulting contracts and companion models.
      </p>
      <div class="hero-actions">
        <a class="button-link primary" href="#documents">Browse documents</a>
        <a class="button-link secondary" href="#openapi">OpenAPI viewers</a>
      </div>
    </section>

    <div class="layout">
      ${renderSidebar(markdownFiles, openApiFiles, htmlRelative)}
      <main>
        <section class="notice-card">
          <h2>Scope of the Published Site</h2>
          <p>
            The public Pages output contains the architecture source document, the schema and model documents, and the OpenAPI drafts.
            The internal planning documents under <code>plans/</code> are not rendered into the published site.
          </p>
        </section>

        <section id="documents" class="catalog-grid">
          ${groups.map((group) => renderDocumentGroupCard(outputPath, group)).join('\n')}
        </section>

        <section id="openapi" class="catalog-grid">
          <section class="catalog-card" style="grid-column: 1 / -1;">
            <p class="eyebrow">Interactive Contracts</p>
            <h2>OpenAPI Draft Viewers</h2>
            <p class="lead">HTTP-oriented drafts open in standalone Redoc pages. Non-HTTP drafts without paths get a schema-oriented contract view generated from the same OpenAPI source.</p>
            <ul>
              ${openApiFiles.map((file) => renderOpenApiIndexLink(outputPath, file)).join('\n')}
            </ul>
          </section>
        </section>

        <section class="notice-card">
          <h2>Language Context</h2>
          <p>
            The specification content remains primarily in German because the first operational rollout is focused on Germany.
            The surrounding portal and publishing setup are in English so the repository stays understandable on GitHub.
          </p>
        </section>
      </main>
    </div>
  `;

  const page = renderHtmlPage({
    title: 'RooK Service Channel Specification Portal',
    subtitle: 'Static documentation site for Markdown specifications and OpenAPI drafts.',
    htmlRelative,
    markdownFiles,
    openApiFiles,
    body,
    includePageHeader: false,
  });

  await fs.writeFile(outputPath, page);
}

async function buildFallbackPage(markdownFiles, openApiFiles) {
  const outputPath = path.join(outDir, '404.html');
  const htmlRelative = '404.html';
  const body = `
    <section class="hero">
      <p class="eyebrow">Page Not Found</p>
      <h1>This page does not exist in the generated specification portal.</h1>
      <p>Use the navigation to return to the repository overview or one of the generated contract pages.</p>
      <div class="hero-actions">
        <a class="button-link primary" href="${escapeHtml(relativeHref(outputPath, path.join(outDir, 'index.html')))}">Go to portal home</a>
      </div>
    </section>
  `;

  const page = renderHtmlPage({
    title: 'Not Found',
    subtitle: 'Static fallback page for GitHub Pages.',
    htmlRelative,
    markdownFiles,
    openApiFiles,
    body,
    includePageHeader: false,
  });

  await fs.writeFile(outputPath, page);
}

function renderHtmlPage({ title, subtitle, htmlRelative, markdownFiles, openApiFiles, body, includePageHeader = true }) {
  const outputPath = path.join(outDir, htmlRelative);
  const pageHeader = includePageHeader
    ? `
      <div class="page-topbar">
        <div>
          <div class="breadcrumbs">${renderBreadcrumbs(htmlRelative)}</div>
          <h1 class="page-title">${escapeHtml(title)}</h1>
          <p class="page-subtitle">${escapeHtml(subtitle)}</p>
        </div>
        <div class="hero-actions">
          <a class="button-link secondary" href="${escapeHtml(relativeHref(outputPath, path.join(outDir, 'index.html')))}">Portal home</a>
        </div>
      </div>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="Generated documentation site for the RooK service channel specification repository.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${escapeHtml(relativeHref(outputPath, path.join(outDir, 'assets/style.css')))}">
  </head>
  <body>
    <div class="site-shell">
      ${includePageHeader ? '<div class="hero" style="padding: 18px 22px;"><p class="eyebrow">Specification Portal</p><p class="meta">Static HTML rendering for Markdown documents and OpenAPI drafts.</p></div>' : ''}
      <div class="layout">
        ${renderSidebar(markdownFiles, openApiFiles, htmlRelative)}
        <main>
          <section class="content-card">
            ${pageHeader}
            ${body}
          </section>
        </main>
      </div>
      <footer class="footer">
        Generated from repository sources. Markdown documents stay authored in German; the portal shell is in English for GitHub readers.
      </footer>
    </div>
  </body>
</html>`;
}

function renderOpenApiStandalonePage({ title, relativeSource, specHref, outputPath }) {
  const homeHref = relativeHref(outputPath, path.join(outDir, 'index.html'));
  const cssHref = relativeHref(outputPath, path.join(outDir, 'assets/style.css'));

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="Standalone Redoc viewer for ${escapeHtml(relativeSource)}.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${escapeHtml(cssHref)}">
  </head>
  <body class="openapi-page">
    <header class="openapi-topbar">
      <div class="openapi-topbar-inner">
        <div>
          <p class="eyebrow">OpenAPI Viewer</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="page-subtitle">Standalone Redoc page for <code>${escapeHtml(relativeSource)}</code>.</p>
        </div>
        <div class="openapi-actions">
          <a class="button-link secondary" href="${escapeHtml(homeHref)}">Portal home</a>
          <a class="button-link primary" href="${escapeHtml(specHref)}">Download YAML</a>
        </div>
      </div>
    </header>
    <main class="openapi-frame">
      <redoc spec-url="${escapeHtml(specHref)}" hide-hostname="true" expand-responses="200,201"></redoc>
    </main>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`;
}

function renderSchemaContractPage({ title, relativeSource, specHref, outputPath, spec }) {
  const homeHref = relativeHref(outputPath, path.join(outDir, 'index.html'));
  const cssHref = relativeHref(outputPath, path.join(outDir, 'assets/style.css'));
  const info = spec.info || {};
  const tags = Array.isArray(spec.tags) ? spec.tags : [];
  const transport = spec['x-transport'];
  const draftScope = spec['x-draftScope'];
  const schemas = spec.components?.schemas || {};

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="Structured contract view for ${escapeHtml(relativeSource)}.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${escapeHtml(cssHref)}">
  </head>
  <body class="contract-page">
    <div class="contract-shell">
      <section class="hero contract-hero">
        <p class="eyebrow">Contract Draft</p>
        <h1>${escapeHtml(info.title || title)}</h1>
        <p>${escapeHtml(info.description || 'Structured rendering for a non-HTTP OpenAPI-based contract draft.')}</p>
        <div class="hero-actions">
          <a class="button-link secondary" href="${escapeHtml(homeHref)}">Portal home</a>
          <a class="button-link primary" href="${escapeHtml(specHref)}">Download YAML</a>
        </div>
        <p class="meta">Source: <code>${escapeHtml(relativeSource)}</code>${info.version ? ` · Version: <code>${escapeHtml(info.version)}</code>` : ''}</p>
      </section>

      <section class="contract-grid">
        ${renderKeyValueCard('Transport', transport)}
        ${renderDraftScopeCard(draftScope)}
        ${renderTagCard(tags)}
      </section>

      <section class="content-card contract-card">
        <h2>Component Schemas</h2>
        <p class="lead">This draft does not define HTTP paths, so the generated page focuses on the transport metadata and the schema components that make up the actual contract.</p>
        <div class="schema-grid">
          ${Object.entries(schemas).map(([schemaName, schema]) => renderSchemaCard(schemaName, schema)).join('\n') || '<p class="meta">No component schemas defined.</p>'}
        </div>
      </section>
    </div>
  </body>
</html>`;
}

function renderSidebar(markdownFiles, openApiFiles, htmlRelative) {
  const currentOutputPath = path.join(outDir, htmlRelative);
  const markdownSections = [
    { label: 'Architecture', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('docs/')) },
    { label: 'Schemas', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('schemas/')) },
    { label: 'Models', files: markdownFiles.filter((file) => toPosix(path.relative(rootDir, file)).startsWith('models/')) },
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-section">
        <h2>Portal</h2>
        <p class="muted">Browse generated HTML pages and OpenAPI viewers without leaving GitHub Pages.</p>
      </div>
      ${markdownSections.map((section) => renderSidebarSection(currentOutputPath, section.label, section.files, false)).join('\n')}
      ${renderSidebarSection(currentOutputPath, 'OpenAPI', openApiFiles, true)}
    </aside>
  `;
}

function renderSidebarSection(currentOutputPath, label, files, isOpenApi) {
  const items = files.map((file) => {
    const relativeSource = toPosix(path.relative(rootDir, file));
    const outputTarget = isOpenApi ? getOpenApiHtmlOutputPath(file) : getMarkdownOutputPath(file);
    const href = relativeHref(currentOutputPath, outputTarget);
    return `<li><a href="${escapeHtml(href)}">${escapeHtml(labelForFile(relativeSource, isOpenApi))}</a></li>`;
  }).join('\n');

  return `
    <div class="sidebar-section">
      <h2>${escapeHtml(label)}</h2>
      <ul>${items}</ul>
    </div>
  `;
}

function renderDocumentGroupCard(currentOutputPath, group) {
  return `
    <section class="catalog-card">
      <span class="group-label">${escapeHtml(group.label)}</span>
      <h2>${escapeHtml(group.label)}</h2>
      <p class="lead">${escapeHtml(group.description)}</p>
      <ul>
        ${group.files.map((file) => {
          const relativeSource = toPosix(path.relative(rootDir, file));
          const href = relativeHref(currentOutputPath, getMarkdownOutputPath(file));
          return `<li><a class="doc-link" href="${escapeHtml(href)}"><span>${escapeHtml(labelForFile(relativeSource, false))}</span><small>${escapeHtml(relativeSource)}</small></a></li>`;
        }).join('\n')}
      </ul>
    </section>
  `;
}

function renderOpenApiIndexLink(currentOutputPath, file) {
  const relativeSource = toPosix(path.relative(rootDir, file));
  const href = relativeHref(currentOutputPath, getOpenApiHtmlOutputPath(file));
  const downloadHref = relativeHref(currentOutputPath, path.join(outDir, relativeSource));

  return `
    <li>
      <div class="doc-link">
        <a href="${escapeHtml(href)}">${escapeHtml(labelForFile(relativeSource, true))}</a>
        <small><a href="${escapeHtml(downloadHref)}">YAML</a></small>
      </div>
    </li>
  `;
}

function renderBreadcrumbs(htmlRelative) {
  const parts = toPosix(htmlRelative).split('/');
  const crumbs = [{ label: 'Home', href: relativeHref(path.join(outDir, htmlRelative), path.join(outDir, 'index.html')) }];

  if (parts.length === 1) {
    return crumbs.map((crumb) => `<a href="${escapeHtml(crumb.href)}">${escapeHtml(crumb.label)}</a>`).join('<span>/</span>');
  }

  for (const part of parts.slice(0, -1)) {
    crumbs.push({ label: humanizeFileName(part), href: '#' });
  }

  crumbs.push({ label: humanizeFileName(parts.at(-1).replace(/\.html$/i, '')), href: '#' });
  return crumbs.map((crumb) => crumb.href === '#'
    ? `<span>${escapeHtml(crumb.label)}</span>`
    : `<a href="${escapeHtml(crumb.href)}">${escapeHtml(crumb.label)}</a>`).join('<span>/</span>');
}

function getMarkdownOutputPath(filePath) {
  const relativeSource = toPosix(path.relative(rootDir, filePath));
  return path.join(outDir, relativeSource.replace(/\.md$/i, '.html'));
}

function getOpenApiHtmlOutputPath(filePath) {
  const relativeSource = toPosix(path.relative(rootDir, filePath));
  return path.join(outDir, relativeSource.replace(/\.ya?ml$/i, '.html'));
}

function labelForFile(relativeSource, isOpenApi) {
  const baseName = path.basename(relativeSource, path.extname(relativeSource));
  return isOpenApi ? `${humanizeFileName(baseName)} viewer` : humanizeFileName(baseName);
}

function hasDocumentedPaths(spec) {
  return !!spec?.paths && Object.keys(spec.paths).length > 0;
}

function renderKeyValueCard(title, value) {
  if (!value || typeof value !== 'object') {
    return '';
  }

  return `
    <section class="catalog-card contract-card">
      <h2>${escapeHtml(title)}</h2>
      ${renderObjectTable(value)}
    </section>
  `;
}

function renderDraftScopeCard(draftScope) {
  if (!draftScope || typeof draftScope !== 'object') {
    return '';
  }

  const topLevel = Object.entries(draftScope)
    .filter(([, value]) => !Array.isArray(value) && (typeof value !== 'object' || value === null));
  const arrays = Object.entries(draftScope)
    .filter(([, value]) => Array.isArray(value));
  const objects = Object.entries(draftScope)
    .filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value));

  return `
    <section class="catalog-card contract-card">
      <h2>Draft Scope</h2>
      ${topLevel.length ? renderObjectTable(Object.fromEntries(topLevel)) : ''}
      ${arrays.map(([key, value]) => renderListBlock(key, value)).join('')}
      ${objects.map(([key, value]) => `<div class="nested-block"><h3>${escapeHtml(humanizeKey(key))}</h3>${renderObjectTable(value)}</div>`).join('')}
    </section>
  `;
}

function renderTagCard(tags) {
  if (!tags.length) {
    return '';
  }

  return `
    <section class="catalog-card contract-card">
      <h2>Tags</h2>
      <div class="badge-list">
        ${tags.map((tag) => `<span class="tag-badge">${escapeHtml(tag.name || String(tag))}</span>`).join('')}
      </div>
      ${tags.some((tag) => tag.description) ? `<div class="tag-list">${tags.map((tag) => tag.description ? `<p><strong>${escapeHtml(tag.name)}:</strong> ${escapeHtml(tag.description)}</p>` : '').join('')}</div>` : ''}
    </section>
  `;
}

function renderObjectTable(objectValue) {
  const entries = Object.entries(objectValue || {});
  if (!entries.length) {
    return '<p class="meta">No structured fields recorded.</p>';
  }

  return `
    <table class="property-table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map(([key, value]) => `<tr><td>${escapeHtml(humanizeKey(key))}</td><td>${renderValue(value)}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function renderListBlock(title, values) {
  return `
    <div class="nested-block">
      <h3>${escapeHtml(humanizeKey(title))}</h3>
      <ul class="inline-list">
        ${values.map((value) => `<li>${renderValue(value)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderSchemaCard(schemaName, schema) {
  return `
    <article class="schema-card">
      <h3>${escapeHtml(schemaName)}</h3>
      ${schema.description ? `<p class="lead">${escapeHtml(schema.description)}</p>` : ''}
      <div class="schema-meta">
        ${renderSchemaSummary(schema)}
      </div>
      ${renderSchemaComposition(schema)}
      ${renderSchemaProperties(schema)}
    </article>
  `;
}

function renderSchemaSummary(schema) {
  const summaryItems = [];

  if (schema.type) {
    summaryItems.push(`<span class="tag-badge">type: ${escapeHtml(schema.type)}</span>`);
  }
  if (schema.const !== undefined) {
    summaryItems.push(`<span class="tag-badge">const: ${escapeHtml(String(schema.const))}</span>`);
  }
  if (Array.isArray(schema.enum)) {
    summaryItems.push(`<span class="tag-badge">enum: ${escapeHtml(schema.enum.join(', '))}</span>`);
  }
  if (schema.additionalProperties === false) {
    summaryItems.push('<span class="tag-badge">closed object</span>');
  }
  if (Array.isArray(schema.required) && schema.required.length) {
    summaryItems.push(`<span class="tag-badge">required: ${escapeHtml(schema.required.join(', '))}</span>`);
  }

  return summaryItems.join('') || '<p class="meta">No top-level summary fields.</p>';
}

function renderSchemaComposition(schema) {
  const compositions = [
    ['allOf', schema.allOf],
    ['oneOf', schema.oneOf],
    ['anyOf', schema.anyOf],
  ].filter(([, value]) => Array.isArray(value) && value.length);

  if (!compositions.length) {
    return '';
  }

  return compositions.map(([label, items]) => `
    <div class="nested-block">
      <h4>${escapeHtml(label)}</h4>
      <ul class="inline-list">
        ${items.map((item) => `<li>${renderSchemaRefOrShape(item)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderSchemaProperties(schema) {
  if (schema.properties && typeof schema.properties === 'object') {
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);
    return `
      <div class="nested-block">
        <h4>Properties</h4>
        <table class="property-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(schema.properties).map(([name, propertySchema]) => `
              <tr>
                <td>${escapeHtml(name)}${required.has(name) ? ' <strong>(required)</strong>' : ''}</td>
                <td>${renderSchemaRefOrShape(propertySchema)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (schema.items) {
    return `
      <div class="nested-block">
        <h4>Items</h4>
        <p>${renderSchemaRefOrShape(schema.items)}</p>
      </div>
    `;
  }

  return '';
}

function renderSchemaRefOrShape(schema) {
  if (!schema || typeof schema !== 'object') {
    return renderValue(schema);
  }

  if (schema.$ref) {
    return `<code>${escapeHtml(schema.$ref)}</code>`;
  }

  const parts = [];
  if (schema.type) {
    parts.push(`type: ${schema.type}`);
  }
  if (schema.const !== undefined) {
    parts.push(`const: ${schema.const}`);
  }
  if (Array.isArray(schema.enum)) {
    parts.push(`enum: ${schema.enum.join(', ')}`);
  }
  if (schema.description) {
    parts.push(schema.description);
  }
  if (schema.oneOf) {
    parts.push(`oneOf(${schema.oneOf.length})`);
  }
  if (schema.allOf) {
    parts.push(`allOf(${schema.allOf.length})`);
  }
  if (schema.items) {
    parts.push(`items: ${stripHtml(renderSchemaRefOrShape(schema.items))}`);
  }

  return escapeHtml(parts.join(' · ') || JSON.stringify(schema));
}

function renderValue(value) {
  if (Array.isArray(value)) {
    return value.length ? value.map((item) => `<code>${escapeHtml(String(item))}</code>`).join(', ') : '<span class="meta">empty list</span>';
  }
  if (value && typeof value === 'object') {
    return `<code>${escapeHtml(JSON.stringify(value))}</code>`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (value === null || value === undefined || value === '') {
    return '<span class="meta">n/a</span>';
  }

  return `<code>${escapeHtml(String(value))}</code>`;
}

function humanizeKey(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stripHtml(value) {
  return String(value).replace(/<[^>]+>/g, '');
}

function extractTitle(markdownSource, fallback) {
  const match = markdownSource.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : humanizeFileName(path.basename(fallback, path.extname(fallback)));
}

function humanizeFileName(value) {
  return value
    .replace(/\.openapi$/i, '')
    .replace(/^[0-9]+[-_]?/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function relativeHref(fromPath, toPath) {
  return toPosix(path.relative(path.dirname(fromPath), toPath)) || '.';
}

function rewriteMarkdownHref(href) {
  if (!href || /^(https?:|mailto:|#)/i.test(href)) {
    return href;
  }

  if (href.endsWith('.md')) {
    return href.replace(/\.md$/i, '.html');
  }

  if (href.endsWith('.openapi.yaml') || href.endsWith('.openapi.yml')) {
    return href.replace(/\.ya?ml$/i, '.html');
  }

  return href;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

await main();