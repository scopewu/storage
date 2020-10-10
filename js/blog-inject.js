var disqusEmbed = 'https://wenjun.disqus.com/embed.js';
var pathname = location.pathname;
window.disqus_config = function () {
  this.page.url = location.href;
  this.page.identifier = pathname;
};
if (/^\/\d{4}\/\d{1,2}\//.test(pathname)) {
  document.addEventListener('DOMContentLoaded', function () {
    const d = document,
      s = d.createElement('script');
    s.src = disqusEmbed;
    s.setAttribute('data-timestamp', +new Date());
    s.async = 1;
    (d.body || d.head).appendChild(s);
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
