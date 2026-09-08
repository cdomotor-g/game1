/* The print picker. A section prints with its title page; open one to choose
   single chapters. ?print=rules,annex-2 preselects (nothing prints on its own -
   a browser would refuse the dialog anyway). Inlined by tools/build-book.mjs. */
(function () {
  'use strict';
  var panel = document.getElementById('print-panel');
  var picks = document.getElementById('picks');
  var parts = Array.prototype.slice.call(document.querySelectorAll('section.part[data-label]'));

  parts.forEach(function (part) {
    var chapters = Array.prototype.slice.call(part.querySelectorAll('article.chapter'));
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
        Array.prototype.forEach.call(det.querySelectorAll('.ch-box'), function (b) { b.checked = box.checked; });
      });
    }
    picks.appendChild(wrap);
  });

  function setAll(on) {
    Array.prototype.forEach.call(picks.querySelectorAll('input'), function (b) { b.checked = on; });
  }
  function apply() {
    document.body.classList.add('selective');
    Array.prototype.forEach.call(picks.querySelectorAll('.part-box'), function (b) {
      var part = document.getElementById(b.value);
      part.classList.toggle('chosen', b.checked);
    });
    Array.prototype.forEach.call(picks.querySelectorAll('.ch-box'), function (b) {
      var ch = document.getElementById(b.value);
      ch.classList.toggle('chosen', b.checked);
    });
    /* a part with no chapter boxes (cover, contents) and every chapter of a
       part whose box is on but has no detail list */
    parts.forEach(function (part) {
      var boxes = picks.querySelectorAll('.ch-box[data-part="' + part.id + '"]');
      if (!boxes.length) Array.prototype.forEach.call(part.querySelectorAll('article.chapter'), function (ch) { ch.classList.toggle('chosen', part.classList.contains('chosen')); });
    });
  }
  function clear() {
    document.body.classList.remove('selective');
    Array.prototype.forEach.call(document.querySelectorAll('.chosen'), function (el) { el.classList.remove('chosen'); });
  }
  function printSelection() {
    apply();
    panel.hidden = true;
    /* give the browser a frame to lay the hidden sections out of the page */
    setTimeout(function () { window.print(); }, 60);
  }
  window.addEventListener('afterprint', clear);

  document.getElementById('open-print').addEventListener('click', function () { panel.hidden = false; });
  document.getElementById('close-print').addEventListener('click', function () { panel.hidden = true; });
  document.getElementById('pick-all').addEventListener('click', function () { setAll(true); });
  document.getElementById('pick-none').addEventListener('click', function () { setAll(false); });
  document.getElementById('do-print').addEventListener('click', printSelection);
  panel.addEventListener('click', function (e) { if (e.target === panel) panel.hidden = true; });

  Array.prototype.forEach.call(document.querySelectorAll('.print-this'), function (btn) {
    btn.addEventListener('click', function () {
      setAll(false);
      var id = btn.getAttribute('data-part');
      Array.prototype.forEach.call(picks.querySelectorAll('input'), function (b) {
        if (b.value === id || b.getAttribute('data-part') === id) b.checked = true;
      });
      printSelection();
    });
  });

  /* ?print=rules,annex-2 preselects and opens the panel; add &now and the
     selection is applied at once with no panel, which is how
     tools/book-proof.mjs prints a section headless. */
  var q = /[?&]print=([^&]+)/.exec(location.search);
  if (q) {
    var want = q[1].split(',');
    setAll(false);
    Array.prototype.forEach.call(picks.querySelectorAll('input'), function (b) {
      if (want.indexOf(b.value) !== -1 || want.indexOf(b.getAttribute('data-part')) !== -1) b.checked = true;
    });
    /* a chosen chapter needs its section on, the way a click would have done */
    Array.prototype.forEach.call(picks.querySelectorAll('.ch-box'), function (b) {
      if (b.checked) picks.querySelector('.part-box[value="' + b.getAttribute('data-part') + '"]').checked = true;
    });
    if (/[?&]now\b/.test(location.search)) apply();
    else panel.hidden = false;
  }
})();
