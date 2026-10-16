import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const origin = new URL(process.argv[2] || "http://127.0.0.1:3000");
const response = await fetch(origin, { signal: AbortSignal.timeout(15000) });
assert.equal(response.status, 200, "La página debe responder HTTP 200");
const html = await response.text();
assert.match(html, /<html[^>]*lang="es"/, "Idioma español");
assert.match(html, /<main[\s>]/, "Contenido principal en el HTML inicial");
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "Un encabezado principal");
const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
assert.ok(h1?.[1].replace(/<!--.*?-->/gs, "").trim(), "Encabezado principal no vacío en el HTML");
const headings = Array.from(html.matchAll(/<section[\s\S]*?<h2[^>]*>(.*?)<\/h2>/g), (match) => match[1]);
assert.deepEqual(headings, ["contacto", "Sobre Mi", "Habilidades", "Experiencia", "proyectos"], "Secciones originales y orden");
const layout = await readFile(new URL("../app/layout.js", import.meta.url), "utf8");
for (const field of ["title", "description"]) {
  const value = layout.match(new RegExp(`${field}: "([^"]+)"`))?.[1];
  assert.ok(value && html.includes(value), `Metadato ${field} presente`);
}
const resources = new Set();
for (const file of await readdir(new URL("../data/", import.meta.url))) {
  if (!file.endsWith(".js")) continue;
  const text = await readFile(new URL(`../data/${file}`, import.meta.url), "utf8");
  for (const match of text.matchAll(/"(\/(?:images|files)\/[^"\s]+)"/g)) resources.add(match[1]);
}
for (const resource of resources) {
  const asset = await fetch(new URL(resource, origin), { method: "HEAD", signal: AbortSignal.timeout(15000) });
  assert.equal(asset.status, 200, `Recurso disponible: ${resource}`);
  assert.ok(Number(asset.headers.get("content-length")) > 0, `Recurso no vacío: ${resource}`);
}
console.log(`Correcto: HTML inicial, idioma, secciones, metadatos y ${resources.size} recursos locales.`);
