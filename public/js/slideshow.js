$(document).ready(function () {
	$mediaWrapper = $('.js-media-wrapper');
	if ($mediaWrapper.data('media-format') === 'slideshow') {
		// Init Slick Sider With Options
		$mediaWrapper.slick({
			adaptiveHeight: true,
			nextArrow: '.slick__next',
			prevArrow: '.slick__prev',
			draggable: false,
			swipe: false
		});

		// Slider Events
		var rateLimit = false;
		function beforeChange(event, slick, currentSlide, nextSlide) {
			if (rateLimit === false) {
				rateLimit = true;

				// 2 second rate limit
				setTimeout( function () {
					rateLimit = false;
				}, 2000)

				// New Pageview
				ga('send', 'pageview');
				fbq('track', 'PageView');

				// Refresh Ads
				googletag.cmd.push(function() {
					googletag.pubads().refresh();
				});
			}

		};
		$mediaWrapper.on('beforeChange', beforeChange);
	}
});