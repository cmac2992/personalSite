// Enable Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId      : '$$FB_APP_ID$$',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.4' // use version 2.4
  });
};

// Load the Facebook SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function getData () {
	FB.api('/me', function (response) {
		var email = response.email;
		if (email) {
			emailSubscribe(email);
		}
	});
}

$(document).ready( function () {

	// Facebook Login
	$('.js-facebook-login').click(function () {
		FB.login( function(response) {
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				getData();
			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
			}
		}, {
			scope: 'email, user_friends, public_profile',
			return_scopes: true
		});
	});

	// Facebook Share
	$('.js-facebook-share').click(function (e) {
		e.preventDefault();
		FB.ui({
		  method: 'share',
		  href: window.location.href,
		}, function(response){});
	});

});

