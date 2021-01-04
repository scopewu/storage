var prevLoc = getLoc()
var ticking

var node = document.getElementById('post-comments')
var windowHeight

var threshold = 70

// location helper

function getLoc () {
  return window.scrollY || window.pageYOffset
}

// debounce helpers

function requestScroll () {
  prevLoc = getLoc()
  requestFrame()
}

function requestFrame () {
  if (!ticking) {
    window.requestAnimationFrame(() => check())
    ticking = true
  }
}

// offset helper

function getOffset (node) {
  return node.getBoundingClientRect().top + prevLoc
}

// in viewport helper

function inViewport (node) {
  var viewTop = prevLoc
  var viewBot = viewTop + windowHeight

  var nodeTop = getOffset(node)
  var nodeBot = nodeTop + node.offsetHeight

  var offset = (threshold / 100) * windowHeight

  return (nodeBot >= viewTop - offset) && (nodeTop <= viewBot + offset)
}

function setSource (node) {
  handlers(false)
  
  var s = document.createElement('script')
  s.async = 1
  s.src = 'https://utteranc.es/client.js'
  s.setAttribute('repo', 'scopewu/wenjun.me-comments')
  s.setAttribute('issue-term', 'pathname')
  s.setAttribute('theme', 'github-light')
  s.setAttribute('crossorigin', 'anonymous')

  node.appendChild(s)
}

function handlers (flag) {
  var action = flag
    ? 'addEventListener'
    : 'removeEventListener'

  ;['scroll', 'resize'].forEach(event => window[action](event, requestScroll))
}

function check () {
  windowHeight = window.innerHeight

  inViewport(node) && setSource(node)

  ticking = false
}

var pathname = location.pathname;

if (/^\/\d{4}\/\d{1,2}\//.test(pathname)) {
  handlers(true);

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
    shareNode.addEventListener('click', function(e) {
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
