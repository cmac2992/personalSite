$('.js-email-subscribe-form')
.on('submit', function (e) {
	e.preventDefault();

	var email = $(this).find('.js-email-input').val();
	emailSubscribe(email);
});

emailSubscribe = function (email) {
	$.post('/api/emailSubscribe', {
		email: email
	}, function (response) {
		if (response.success) {
			// Show Subscribed Successfully
			$('.js-email-subscribe-form').text('You have been subscribed successfully.');
		}
	});
};