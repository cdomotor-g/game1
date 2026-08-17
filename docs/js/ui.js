/* Tiny DOM helpers. Deliberately not a framework. */
(function (global) {
  'use strict';

  /**
   * el('div.card', {onclick: fn}, [children])
   * Tag string supports `tag.class.class#id`.
   */
  function el(spec, props, children) {
    const [head, ...classes] = String(spec).split('.');
    const [tag, id] = head.split('#');
    const node = document.createElement(tag || 'div');
    if (id) node.id = id;
    if (classes.length) node.className = classes.join(' ');

    if (props && (Array.isArray(props) || typeof props === 'string' || props instanceof Node)) {
      children = props;
      props = null;
    }
    for (const key in props || {}) {
      const v = props[key];
      if (v === undefined || v === null || v === false) continue;
      if (key.startsWith('on') && typeof v === 'function') node.addEventListener(key.slice(2), v);
      else if (key === 'class') node.className += (node.className ? ' ' : '') + v;
      else if (key === 'html') node.innerHTML = v;
      else if (key === 'text') node.textContent = v;
      else if (key === 'dataset') Object.assign(node.dataset, v);
      else if (v === true) node.setAttribute(key, '');
      else node.setAttribute(key, v);
    }
    append(node, children);
    return node;
  }

  function append(node, children) {
    if (children === undefined || children === null || children === false) return node;
    if (Array.isArray(children)) {
      children.forEach((c) => append(node, c));
      return node;
    }
    node.appendChild(children instanceof Node ? children : document.createTextNode(String(children)));
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  /** Title Case from a kebab id, for anything that has no name field. */
  function titleize(id) {
    return String(id).split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  function plural(n, one, many) {
    return `${n} ${n === 1 ? one : many || one + 's'}`;
  }

  /** Case-insensitive substring match across a few fields. */
  function matches(entry, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    const hay = [entry.id, entry.name, entry.summary, entry.notes, entry.category, entry.family, entry.text,
      entry.story, entry.quirk, entry.calling, entry.element, entry.people, entry.mode, entry.cardCode]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  }

  function pill(text, kind) {
    return el('span.pill' + (kind ? '.' + kind : ''), text);
  }

  function bar(fraction, extraClass) {
    const pct = Math.max(0, Math.min(1, fraction)) * 100;
    return el('div.bar' + (extraClass ? '.' + extraClass : ''), [el('span', { style: `width:${pct}%` })]);
  }

  global.UI = { el, clear, append, titleize, plural, matches, pill, bar };
})(window);
