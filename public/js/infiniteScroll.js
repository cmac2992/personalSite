$(document).ready(function () {
	$('.js-load-more').click(function (e) {
		e.preventDefault();
		var $self = $(this);
		var filters = $self.data('filters');
		var htmlFormat = $('.js-infinite-container').data('html-format');
		filters = $.extend(filters, htmlFormat);

		// Increment data-filters page number
		filters.page++;
		$self.data('filters', filters);

		$.ajax({
			url: '/api/post/search',
			data: filters
		})
		.done( function (response) {
			if (response.html) {
				$('.js-infinite-container').append(response.html);
			}

			// Hide Button if end of results
			if (response.next === false) {
				$self.text("No More Results :(");
			}
		});
	});
});