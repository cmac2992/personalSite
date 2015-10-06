var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
  var gads = document.createElement('script');
  gads.async = true;
  gads.type = 'text/javascript';
  var useSSL = 'https:' == document.location.protocol;
  gads.src = (useSSL ? 'https:' : 'http:') +
    '//www.googletagservices.com/tag/js/gpt.js';
  var node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(gads, node);
})();

googletag.cmd.push(function() {
    // Define Size Mappings
    var headerMapping = googletag.sizeMapping()
      .addSize([0, 0], [])
      .addSize([768, 0], [728, 90])
      .build();

    var postTopMapping = googletag.sizeMapping()
      .addSize([767, 0], [])
      .addSize([0,0], [[320, 50],[320, 100]])
      .build();

    var postBottomMapping = googletag.sizeMapping()
      .addSize([767, 0], [])
      .addSize([0,0], [[320, 50],[320, 100]])
      .build();

    // Define Slots
    googletag.defineSlot('/47865238/cheeserank_header_728x90_atf', [728, 90], 'cheeserank_header_728x90_atf')
      .defineSizeMapping(headerMapping)
      .addService(googletag.pubads());

    googletag.defineSlot('/47865238/cheeserank_sidebar1_300x250_atf', [300, 250], 'cheeserank_sidebar1_300x250_atf')
      .addService(googletag.pubads());

    googletag.defineSlot('/47865238/cheeserank_sidebar2_300x250_atf', [300, 250], 'cheeserank_sidebar2_300x250_atf')
      .addService(googletag.pubads());

    googletag.defineSlot('/47865238/cheeserank_mobile_post_top', [[320, 50],[320, 100]], 'cheeserank_mobile_post_top')
      .defineSizeMapping(postTopMapping)
      .addService(googletag.pubads());

    googletag.defineSlot('/47865238/cheeserank_mobile_post_bottom', [[320, 50],[320, 100]], 'cheeserank_mobile_post_bottom')
      .defineSizeMapping(postBottomMapping)
      .addService(googletag.pubads());

    googletag.pubads().enableSingleRequest();
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();

    // Display Ads
    googletag.display('cheeserank_header_728x90_atf');
    googletag.display('cheeserank_sidebar1_300x250_atf');
    googletag.display('cheeserank_sidebar2_300x250_atf');
    googletag.display('cheeserank_mobile_post_top');
    googletag.display('cheeserank_mobile_post_bottom');
});