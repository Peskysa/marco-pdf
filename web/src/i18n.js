import catalog from './translations.json' with { type: 'json' };
let locale = 'es';
export function t(key, values = {}) {
  const template = locale === 'es' ? key : catalog[key]?.[locale === 'fr' ? 1 : 0] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}
export function setupLanguage(onChange) {
  const nodes = [], attributes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('#ui-language')) continue;
    const original = node.nodeValue;
    if (catalog[original.trim()]) nodes.push({ node, original, key: original.trim() });
  }
  for (const element of document.querySelectorAll('*')) {
    for (const name of ['placeholder', 'aria-label', 'title']) {
      const key = element.getAttribute(name);
      if (catalog[key]) attributes.push({ element, name, key });
    }
  }
  const select = document.getElementById('ui-language');
  select.onchange = () => {
    locale = select.value;
    document.documentElement.lang = locale;
    for (const { node, original, key } of nodes) node.nodeValue = original.replace(key, t(key));
    for (const { element, name, key } of attributes) element.setAttribute(name, t(key));
    onChange();
  };
}
