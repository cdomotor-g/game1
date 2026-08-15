/* Taking a map out of the browser: PNG for anyone who wants a picture, SVG for
 * anyone who wants to edit the overlay.
 *
 * Shared by the viewer and the print sheets so that a file downloaded from
 * either one looks the same. Like map.js this is a plain script rather than a
 * module, because docs/ has to work when you double-click a file off disk.
 *
 * The plate is never touched. An export is the committed artwork with the
 * overlay drawn on top of it, exactly as the pages draw it on screen.
 */
(function (global) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* Each page styles the overlay from its own stylesheet, and a file that has
     left the browser carries no stylesheet with it — so every rule the drawing
     actually depends on is restated here and written inside the SVG. Colours
     that the pages set as attributes (the terrain washes, the grid ink, the
     legend) are already on the nodes and are not repeated.

     Three differences from the screen are deliberate. `vector-effect:
     non-scaling-stroke` is dropped: a hairline that ignores zoom is a screen
     affordance, and at plate resolution it would come out as a thread. `var(--mono)`
     and the rest of the custom properties are spelled out, because nothing
     defines them outside the page. And the selection highlight is dropped,
     because which hex you last clicked is not part of the map. */
  var EXPORT_CSS = [
    '.layer-wash polygon { opacity: .38 }',
    '.layer-grid polygon { fill: none; opacity: .4 }',
    '.layer-labels text { fill: #1A1714; opacity: .5;',
    '  font-family: ui-monospace, Menlo, Consolas, monospace }',
    '.layer-places circle { fill: #EDE4D1; stroke: #A33B26; stroke-width: 3 }',
    '.layer-places text { display: none }',
    '.route { fill: none; stroke-linecap: round; stroke-linejoin: round }',
    '.route.rail { stroke: #1A1714; opacity: .75 }',
    '.route.road { stroke: #8A561C; opacity: .6 }',
    '.route.shipping { stroke: #3C5A6E; opacity: .6 }',
    '.layer-legend .legend-title, .layer-legend .legend-item {',
    '  font-family: Georgia, "Times New Roman", serif }',
  ].join('\n');

  /** A standalone SVG document holding the given layers, at plate size. */
  function overlaySvg(map, layers) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('viewBox', '0 0 ' + map.plate.width + ' ' + map.plate.height);
    svg.setAttribute('width', map.plate.width);
    svg.setAttribute('height', map.plate.height);

    var title = document.createElementNS(SVG_NS, 'title');
    title.textContent = map.name + ' — hex overlay';
    svg.appendChild(title);

    var style = document.createElementNS(SVG_NS, 'style');
    style.textContent = EXPORT_CSS;
    svg.appendChild(style);

    layers.forEach(function (layer) {
      if (!layer) return;
      var copy = layer.cloneNode(true);
      copy.removeAttribute('style');
      Array.prototype.forEach.call(copy.querySelectorAll('.sel'), function (n) {
        n.classList.remove('sel');
      });
      svg.appendChild(copy);
    });
    return svg;
  }

  function serialize(svg) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      new XMLSerializer().serializeToString(svg);
  }

  /** The overlay rasterised on its own, ready to be drawn over the plate. */
  function rasterise(svg, width, height) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.width = width;
      img.height = height;
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('the overlay could not be drawn')); };
      /* A data: URL rather than a blob: URL — Safari refuses to load the latter
         into an <img> that is on its way to a canvas. */
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialize(svg));
    });
  }

  function loadPlate(map) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('the plate ' + map.plate.file + ' could not be read')); };
      img.src = map.plate.file;
    });
  }

  function toBlob(canvas) {
    return new Promise(function (resolve, reject) {
      var done = function (blob) {
        if (blob) resolve(blob);
        else reject(new Error('the image could not be encoded'));
      };
      try {
        canvas.toBlob(done, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * The plate with the given layers drawn over it, as a PNG blob, at the
   * plate's own resolution. Anything else would be inventing detail the
   * artwork does not have.
   */
  function png(map, layers) {
    var w = map.plate.width;
    var h = map.plate.height;
    /* Started off a resolved promise so that a failure while building the
       overlay comes back as a rejection like every other one, and a caller
       never has to unlock its button in two places. */
    return Promise.resolve()
      .then(function () { return Promise.all([loadPlate(map), rasterise(overlaySvg(map, layers), w, h)]); })
      .then(function (images) {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        /* Paper first: a plate with any transparency in it should come out on
           the same oatmeal the game prints on, never on black or on nothing. */
        ctx.fillStyle = '#EDE4D1';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(images[0], 0, 0, w, h);
        ctx.drawImage(images[1], 0, 0, w, h);
        return toBlob(canvas);
      });
  }

  /** The overlay alone, as an SVG blob. No plate, so it stays a few hundred KB. */
  function svg(map, layers) {
    return Promise.resolve().then(function () {
      return new Blob([serialize(overlaySvg(map, layers))], { type: 'image/svg+xml;charset=utf-8' });
    });
  }

  function save(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    /* Revoking immediately cancels the download in Firefox. */
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /**
   * Why a download failed, in words worth reading.
   *
   * The one that catches people out is a canvas the browser will not let go of:
   * opened over file://, every image on the page counts as another origin, so
   * reading the pixels back out is forbidden. Nothing about the map is wrong —
   * the page just has to be served.
   */
  function explain(err) {
    var name = err && err.name;
    if (name === 'SecurityError' || /tainted|insecure/i.test(String(err && err.message))) {
      return 'Downloading needs the page to be served rather than opened off disk. ' +
        'Use the published site, or run a local server in docs/.';
    }
    return (err && err.message) || 'the download failed';
  }

  function humanSize(bytes) {
    return bytes > 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
  }

  global.MapExport = { png: png, svg: svg, save: save, slug: slug, explain: explain, humanSize: humanSize, css: EXPORT_CSS };
})(window);
