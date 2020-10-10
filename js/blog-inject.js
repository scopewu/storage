/*
	disqusLoader.js v1.0
	A JavaScript plugin for lazy-loading Disqus comments widget.
	-
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
	link: https://github.com/osvaldasvalutis/disqusLoader.js
	doc: https://css-tricks.com/lazy-loading-disqus-comments/
*/

(function (window, document, index) {
  'use strict';

  var extendObj = function (defaults, options) {
      var prop,
        extended = {};
      for (prop in defaults)
        if (Object.prototype.hasOwnProperty.call(defaults, prop))
          extended[prop] = defaults[prop];

      for (prop in options)
        if (Object.prototype.hasOwnProperty.call(options, prop))
          extended[prop] = options[prop];

      return extended;
    },
    getOffset = function (el) {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
      };
    },
    loadScript = function (url, callback) {
      var script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.setAttribute('data-timestamp', +new Date());
      script.addEventListener('load', function () {
        if (typeof callback === 'function') callback();
      });
      (document.head || document.body).appendChild(script);
    },
    throttle = function (a, b) {
      var c, d;
      return function () {
        var e = this,
          f = arguments,
          g = +new Date();
        c && g < c + a
          ? (clearTimeout(d),
            (d = setTimeout(function () {
              (c = g), b.apply(e, f);
            }, a)))
          : ((c = g), b.apply(e, f));
      };
    },
    throttleTO = false,
    laziness = false,
    disqusConfig = false,
    scriptUrl = false,
    scriptStatus = 'unloaded',
    instance = false,
    init = function () {
      if (
        !instance ||
        !document.body.contains(instance) ||
        instance.disqusLoaderStatus == 'loaded'
      )
        return true;

      var winST = window.pageYOffset,
        offset = getOffset(instance).top;

      // if the element is too far below || too far above
      if (
        offset - winST > window.innerHeight * laziness ||
        winST - offset - instance.offsetHeight - window.innerHeight * laziness >
        0
      )
        return true;

      var tmp = document.getElementById('disqus_thread');
      if (tmp) tmp.removeAttribute('id');
      instance.setAttribute('id', 'disqus_thread');
      instance.disqusLoaderStatus = 'loaded';

      if (scriptStatus == 'loaded') {
        DISQUS.reset({ reload: true, config: disqusConfig });
      } // unloaded | loading
      else {
        window.disqus_config = disqusConfig;
        if (scriptStatus == 'unloaded') {
          scriptStatus = 'loading';
          loadScript(scriptUrl, function () {
            scriptStatus = 'loaded';
          });
        }
      }
    };

  window.addEventListener('scroll', throttle(throttleTO, init));
  window.addEventListener('resize', throttle(throttleTO, init));

  window.disqusLoader = function (element, options) {
    options = extendObj(
      {
        laziness: 1,
        throttle: 250,
        scriptUrl: false,
        disqusConfig: false,
      },
      options,
    );

    laziness = options.laziness + 1;
    throttleTO = options.throttle;
    disqusConfig = options.disqusConfig;
    scriptUrl = scriptUrl === false ? options.scriptUrl : scriptUrl; // set it only once

    if (typeof element === 'string') instance = document.querySelector(element);
    else if (typeof element.length === 'number') instance = element[0];
    else instance = element;

    if (instance) instance.disqusLoaderStatus = 'unloaded';

    init();
  };
})(window, document, 0);

var pathname = location.pathname;

if (/^\/\d{4}\/\d{1,2}\//.test(pathname)) {
  disqusLoader('#disqus_thread', {
    scriptUrl: 'https://wenjun.disqus.com/embed.js',
    disqusConfig: function () {
      this.page.url = location.href;
      this.page.identifier = pathname;
    },
  });

  /* Share */
  function openSharer(shareUrl) {
    var boxWidth = 626,
      boxHeight = 436;

    var $window = window;
    var docElem = $window.document.documentElement;
    var screen = $window.screen;
    var dualScreenLeft =
      $window.screenLeft !== undefined ? $window.screenLeft : screen.left;
    var dualScreenTop =
      $window.screenTop !== undefined ? $window.screenTop : screen.top;
    var width = $window.innerWidth
      ? $window.innerWidth
      : docElem.clientWidth
        ? docElem.clientWidth
        : screen.width;
    var height = $window.innerHeight
      ? $window.innerHeight
      : docElem.clientHeight
        ? docElem.clientHeight
        : screen.height;
    var left = width / 2 - boxWidth / 2 + dualScreenLeft;
    var top = height / 2 - boxHeight / 2 + dualScreenTop;

    window.open(
      shareUrl,
      'v__sharer',
      'status=yes' +
      ',height=' +
      boxHeight +
      ',width=' +
      boxWidth +
      ',resizable=yes' +
      ',left=' +
      left +
      ',top=' +
      top +
      ',screenX=' +
      left +
      ',screenY=' +
      top +
      ',toolbar=no' +
      ',menubar=no' +
      ',scrollbars=no' +
      ',location=no' +
      ',directories=no',
    );
  }

  try {
    var shareNode = document.getElementsByClassName('share-buttons')[0];
    shareNode &&
    shareNode.addEventListener('click', function (e) {
      e.preventDefault();
      var target = e.target || e.srcElement;
      if (target) {
        if (target.nodeName.toLowerCase() === 'a') {
          var url = target.href;

          openSharer(url);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}
