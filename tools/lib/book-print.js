/* The print picker, and the print view it opens. Inlined by tools/build-book.mjs.

   Printing a selection used to mean hiding the rest of the book from a print
   stylesheet, opening the dialog, and putting the rest back on `afterprint`.
   That holds only where `afterprint` comes after the last page has been drawn,
   and nothing promises it: a dialog that draws its pages later, or lays them out
   again when a setting changes, prints whatever the page says by then. The
   pictures were worse. Every picture in a chapter is lazy, and a lazy picture
   far down the page never loads: picked alone, Chapter III of Book I waited the
   whole ten seconds of the panel's patience on a picture that was never going
   to arrive, then opened the dialog with ten of the thirty-one pictures it
   prints missing and the reader's click long expired. And `beforeprint` swapped every
   big picture in the book for its full copy - 69 MB fetched to print five pages.

   So choosing now takes everything that is not chosen OUT of the page, into a
   print view that shows exactly what will print: one chapter is one chapter's
   worth of page, in every browser, however that browser prints. Every picture
   in it is told to load, the bar counts them in, and the dialog opens when the
   last has arrived. The view stays until the reader leaves it, so a second try
   from the bar - or the browser's own Print command - prints the selection too.

   ?print=rules,annex-2 preselects and opens the panel. &now opens the view at
   once with no panel and no dialog, which is how tools/book-proof.mjs prints
   headless; &pictures=low keeps the screen copies and &titles=off leaves each
   section's title page out, in either. */
(function () {
  'use strict';
  var panel = document.getElementById('print-panel');
  var picks = document.getElementById('picks');
  var bar = document.getElementById('print-bar');
  var what = document.getElementById('print-what');
  var status = document.getElementById('print-status');
  var main = document.querySelector('main.book');
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var parts = all('section.part[data-label]');
  /* Read once. The view takes chapters out of their parts, and a part asked for
     its children while the view is open forgets the ones it is not showing. */
  parts.forEach(function (part) {
    var kids = Array.prototype.slice.call(part.children);
    part.bookChapters = kids.filter(function (el) { return el.matches('article.chapter'); });
    part.bookTitle = kids.filter(function (el) { return el.classList.contains('titlepage'); })[0] || null;
  });
  var chaptersOf = function (part) { return part.bookChapters; };
  var titleOf = function (part) { return part.bookTitle; };
  var boxFor = function (id) { return picks.querySelector('input[value="' + id + '"]'); };

  /* What every picture copy the book names weighs, written in by the build, so
     the panel can say what a choice of pictures costs before it is made. */
  var BYTES = {};
  try { BYTES = JSON.parse(document.getElementById('print-bytes').textContent); } catch (e) { /* no estimate, then */ }

  /* Shown in the page but never printed (tools/lib/book.css): their pictures are
     neither waited for nor swapped. */
  var NOT_PRINTED = '.fig.row.tail, header.chap .fig.frieze, .titlepage.contents .toc-page ~ .tfrieze, .screen-only';

  /* ------------------------------------------------------------ the picks */
  parts.forEach(function (part) {
    var chapters = chaptersOf(part);
    var wrap = document.createElement('div');
    var label = document.createElement('label');
    label.className = 'part-pick';
    var box = document.createElement('input');
    box.type = 'checkbox'; box.className = 'part-box'; box.value = part.id; box.checked = true;
    label.appendChild(box);
    label.appendChild(document.createTextNode(' ' + part.getAttribute('data-label')));
    wrap.appendChild(label);
    if (chapters.length > 1) {
      var det = document.createElement('details');
      var sum = document.createElement('summary');
      sum.textContent = chapters.length + ' chapters';
      det.appendChild(sum);
      chapters.forEach(function (ch) {
        var l = document.createElement('label');
        var b = document.createElement('input');
        b.type = 'checkbox'; b.className = 'ch-box'; b.value = ch.id; b.checked = true; b.setAttribute('data-part', part.id);
        l.appendChild(b);
        l.appendChild(document.createTextNode(' ' + ch.getAttribute('data-title')));
        det.appendChild(l);
        b.addEventListener('change', function () {
          if (b.checked) box.checked = true;
        });
      });
      wrap.appendChild(det);
      box.addEventListener('change', function () {
        all('.ch-box', det).forEach(function (b) { b.checked = box.checked; });
      });
    }
    picks.appendChild(wrap);
  });

  function setAll(on) {
    all('input', picks).forEach(function (b) { b.checked = on; });
  }

  /** What the boxes say: each chosen part with the chapters of it to print. */
  function chosen() {
    var out = [];
    parts.forEach(function (part) {
      if (!boxFor(part.id).checked) return;
      var chapters = chaptersOf(part);
      var picked = chapters.length > 1 ? chapters.filter(function (ch) { return boxFor(ch.id).checked; }) : chapters;
      out.push({ part: part, chapters: picked });
    });
    return out;
  }

  /** Everything a selection prints, in book order: each part's title page -
      unless title pages are off and chapters of it were picked - and then its
      picked chapters. A part with nothing but a title page (the cover, the
      contents) is its title page. */
  function pages(sel, o) {
    var out = [];
    sel.forEach(function (s) {
      var title = titleOf(s.part);
      if (title && (o.titles || !s.chapters.length)) out.push(title);
      out.push.apply(out, s.chapters);
    });
    return out;
  }

  function picturesIn(nodes) {
    var out = [];
    nodes.forEach(function (n) {
      all('img', n).forEach(function (img) { if (!img.closest(NOT_PRINTED)) out.push(img); });
    });
    return out;
  }

  /* ------------------------------------------------------------- options */
  var KEY = 'almanac-print';
  var opts = { pictures: 'full', titles: true };
  try {
    var kept = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (kept && (kept.pictures === 'full' || kept.pictures === 'low')) opts.pictures = kept.pictures;
    if (kept && typeof kept.titles === 'boolean') opts.titles = kept.titles;
  } catch (e) { /* a private window, or storage turned off: the defaults */ }
  function keep() {
    try { localStorage.setItem(KEY, JSON.stringify(opts)); } catch (e) { /* not remembered, then */ }
  }
  function readPanel() {
    var pic = panel.querySelector('input[name="pictures"]:checked');
    return { pictures: pic ? pic.value : opts.pictures, titles: document.getElementById('opt-titles').checked };
  }
  function showOptions(o) {
    all('input[name="pictures"], input[name="pv-pictures"]').forEach(function (r) { r.checked = r.value === o.pictures; });
    document.getElementById('opt-titles').checked = o.titles;
  }

  /* --------------------------------------------------------- what it costs */
  var mb = function (b) { return (b < 10485760 ? (b / 1048576).toFixed(1) : Math.round(b / 1048576)) + ' MB'; };
  function weigh(nodes) {
    var full = {}, low = {};
    picturesIn(nodes).forEach(function (img) {
      var screen = img.getAttribute('data-screen-src') || img.getAttribute('src');
      low[screen] = 1;
      full[img.getAttribute('data-print-src') || screen] = 1;
    });
    /* an inlined card's window is the small copy whichever is chosen */
    nodes.forEach(function (n) {
      all('image', n).forEach(function (im) {
        var href = im.getAttribute('href') || im.getAttribute('xlink:href');
        if (href && !im.closest(NOT_PRINTED)) { low[href] = 1; full[href] = 1; }
      });
    });
    var sum = function (set) { var b = 0; for (var k in set) b += BYTES[k] || 0; return b; };
    return { full: sum(full), low: sum(low) };
  }
  /* Past this a browser is asked to hold more pictures than some of them can,
     and the whole book at full size is three times it. */
  var HEAVY = 30 * 1048576;
  function describeCost() {
    var o = readPanel();
    var nodes = pages(chosen(), o);
    var w = weigh(nodes);
    all('.cost', panel).forEach(function (el) { el.textContent = nodes.length ? '· ' + mb(w[el.getAttribute('data-cost')]) : ''; });
    var note = document.getElementById('print-note');
    if (!nodes.length) note.textContent = 'Nothing is ticked.';
    else if (o.pictures === 'full' && w.full > HEAVY) note.textContent = 'That is a lot of pictures for a browser to print at full size at once. Low resolution, or a section at a time, is safer.';
    else note.textContent = '';
  }

  /* ----------------------------------------------------------- the view */
  var held = [];       /* [mark, node]: what the view took out of the page, and where it goes back */
  var view = null;     /* { nodes, opts, ready, printWhenReady } while the view is open */
  var round = 0;       /* which preparation is current; a newer one makes an older one moot */
  var scrollBack = 0;

  function hold(node) {
    var mark = document.createComment(' kept out of the print view ');
    node.parentNode.replaceChild(mark, node);
    held.push([mark, node]);
  }
  function release() {
    while (held.length) {
      var h = held.pop();
      h[0].parentNode.replaceChild(h[1], h[0]);
    }
  }

  /* Each big picture is shown at the small copy's resolution and names its full
     copy in data-print-src. Full size puts that in; low resolution leaves the
     small one, which is what the screen was showing all along. */
  function setPictures(kind) {
    all('img[data-print-src]', main).forEach(function (img) {
      if (img.closest(NOT_PRINTED)) return;
      var full = img.getAttribute('data-print-src');
      var screen = img.getAttribute('data-screen-src');
      if (kind === 'full') {
        if (img.getAttribute('src') === full) return;
        img.setAttribute('data-screen-src', img.getAttribute('src'));
        img.setAttribute('src', full);
      } else if (screen) {
        img.setAttribute('src', screen);
        img.removeAttribute('data-screen-src');
      }
    });
  }

  function say(state, text) {
    bar.setAttribute('data-state', state);
    status.textContent = text;
  }
  function loading(done, total) {
    say('loading', 'Loading pictures: ' + done + ' of ' + total + '…' + (view.printWhenReady ? ' The print dialog opens when they are in.' : ''));
  }

  function summary(sel) {
    return sel.map(function (s) {
      var label = s.part.getAttribute('data-label');
      var count = chaptersOf(s.part).length;
      if (!s.chapters.length || s.chapters.length === count) return label;
      if (s.chapters.length === 1) return label + ': ' + s.chapters[0].getAttribute('data-title');
      return label + ': ' + s.chapters.length + ' of ' + count + ' chapters';
    }).join(' · ');
  }

  function openView(sel, o, auto) {
    var nodes = pages(sel, o);
    if (!nodes.length) return;
    if (view) closeView(true);
    else scrollBack = window.pageYOffset;
    /* said before anything is taken out, while a part still knows its chapters */
    what.textContent = summary(sel);
    parts.forEach(function (part) {
      var kids = [titleOf(part)].concat(chaptersOf(part)).filter(Boolean);
      var mine = kids.filter(function (k) { return nodes.indexOf(k) !== -1; });
      if (!mine.length) { hold(part); return; }
      kids.forEach(function (k) { if (mine.indexOf(k) === -1) hold(k); });
    });
    view = { nodes: nodes, opts: { pictures: o.pictures, titles: o.titles }, ready: false, printWhenReady: !!auto };
    document.body.classList.add('print-view');
    showOptions(view.opts);
    bar.hidden = false;
    window.scrollTo(0, 0);
    prepare();
  }

  function closeView(quiet) {
    round++;
    release();
    setPictures('low');
    document.body.classList.remove('print-view');
    bar.hidden = true;
    view = null;
    if (!quiet) window.scrollTo(0, scrollBack);
  }

  /* A lazy picture loads when it nears the screen, and a picture in a chapter
     the reader has not scrolled to never does - so every picture in the view is
     made eager and counted in, and the view is ready when the last has loaded
     or failed. A picture that has not come in a minute and a half does not hold
     the dialog shut: the bar says how many are missing and Print still prints. */
  var PATIENCE = 90000;
  function prepare() {
    var mine = ++round;
    view.ready = false;
    setPictures(view.opts.pictures);
    var imgs = picturesIn(view.nodes);
    var pending = imgs.filter(function (img) {
      if (img.loading === 'lazy') img.loading = 'eager';
      return !img.complete;
    });
    var total = imgs.length;
    var left = pending.length;
    var failed = 0;
    var missing = function () { say('partial', left + ' of ' + total + ' pictures have not arrived. Print now, or wait for them.'); };
    var finish = function (whole) {
      if (mine !== round) return;
      view.ready = true;
      var printing = whole && view.printWhenReady;
      var got = !total ? 'Ready.' : failed ? 'Ready: ' + (total - failed) + ' of ' + total + ' pictures are in; ' + failed + ' could not be fetched.' : 'Ready: all ' + total + ' pictures are in.';
      if (whole) say('ready', got + (printing ? ' If the print dialog does not open, press Print.' : ''));
      else missing();
      if (printing) {
        view.printWhenReady = false;
        /* a frame for the browser to lay the last pictures out */
        setTimeout(function () { if (mine === round) window.print(); }, 80);
      }
    };
    if (!left) { finish(true); return; }
    loading(total - left, total);
    var timer = setTimeout(function () { finish(false); }, PATIENCE);
    pending.forEach(function (img) {
      var done = function (e) {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
        if (mine !== round) return;
        left--;
        if (e.type === 'error') failed++;
        if (!left) { clearTimeout(timer); finish(true); }
        else if (view.ready) missing();
        else loading(total - left, total);
      };
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    });
  }

  function printView() {
    if (!view) return;
    if (view.ready) { window.print(); return; }
    view.printWhenReady = true;
    var n = /(\d+) of (\d+)/.exec(status.textContent);
    if (n) loading(+n[1], +n[2]);
  }

  /* --------------------------------------------------------------- wiring */
  function openPanel() {
    showOptions(opts);
    describeCost();
    panel.hidden = false;
  }
  function printSelection() {
    var o = readPanel();
    opts.pictures = o.pictures; opts.titles = o.titles; keep();
    var sel = chosen();
    if (!pages(sel, o).length) { describeCost(); return; }
    panel.hidden = true;
    openView(sel, o, true);
  }

  picks.addEventListener('change', describeCost);
  all('input[name="pictures"], #opt-titles', panel).forEach(function (el) { el.addEventListener('change', describeCost); });
  document.getElementById('open-print').addEventListener('click', openPanel);
  document.getElementById('close-print').addEventListener('click', function () { panel.hidden = true; });
  document.getElementById('pick-all').addEventListener('click', function () { setAll(true); describeCost(); });
  document.getElementById('pick-none').addEventListener('click', function () { setAll(false); describeCost(); });
  document.getElementById('do-print').addEventListener('click', printSelection);
  panel.addEventListener('click', function (e) { if (e.target === panel) panel.hidden = true; });

  document.getElementById('pv-print').addEventListener('click', printView);
  document.getElementById('pv-change').addEventListener('click', openPanel);
  document.getElementById('pv-back').addEventListener('click', function () { closeView(false); });
  all('input[name="pv-pictures"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (!view || !r.checked) return;
      opts.pictures = r.value; keep();
      view.opts.pictures = r.value;
      showOptions(view.opts);
      prepare();
    });
  });

  all('.print-this').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setAll(false);
      var id = btn.getAttribute('data-part');
      all('input', picks).forEach(function (b) {
        if (b.value === id || b.getAttribute('data-part') === id) b.checked = true;
      });
      openView(chosen(), opts, true);
    });
  });

  /* The browser's own Print command, outside the view, would print all three
     hundred pages of the book: it opens the panel instead. In the view it
     prints the view, once its pictures are in. */
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || (e.key !== 'p' && e.key !== 'P')) return;
    if (view && view.ready) return;
    e.preventDefault();
    if (view) printView(); else openPanel();
  });

  /* ?print=rules,annex-2 preselects and opens the panel; &now opens the view at
     once, with no panel and no dialog, which is how tools/book-proof.mjs prints
     headless - and a proof has to be what a reader gets, so it is the same view,
     loading the same pictures. */
  var q = /[?&]print=([^&]+)/.exec(location.search);
  if (q) {
    var want = q[1].split(',');
    setAll(false);
    all('input', picks).forEach(function (b) {
      if (want.indexOf(b.value) !== -1 || want.indexOf(b.getAttribute('data-part')) !== -1) b.checked = true;
    });
    /* a chosen chapter needs its section on, the way a click would have done */
    all('.ch-box', picks).forEach(function (b) {
      if (b.checked) boxFor(b.getAttribute('data-part')).checked = true;
    });
    var low = /[?&]pictures=low\b/.test(location.search);
    var bare = /[?&]titles=off\b/.test(location.search);
    if (/[?&]now\b/.test(location.search)) openView(chosen(), { pictures: low ? 'low' : 'full', titles: !bare }, false);
    else {
      if (low) opts.pictures = 'low';
      if (bare) opts.titles = false;
      openPanel();
    }
  }
})();
