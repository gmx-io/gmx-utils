import queryString from 'query-string';

// src/lib/buildUrl.ts
function buildUrl(baseUrl, path, query) {
  const qs = query ? `?${queryString.stringify(query)}` : "";
  baseUrl = baseUrl.replace(/\/$/, "");
  return `${baseUrl}${path}${qs}`;
}

export { buildUrl };
//# sourceMappingURL=buildUrl.js.map
//# sourceMappingURL=buildUrl.js.map