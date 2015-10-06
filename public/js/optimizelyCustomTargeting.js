// Explicitly save/update a url parameter using HTML5's replaceState().
function updateQueryStringParam(key, value) {
  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  urlQueryString = document.location.search;
  var newParam = key + '=' + value,
  params = '?' + newParam;

  // If the "search" string exists, then build params from it
  if (urlQueryString) {
    keyRegex = new RegExp('([\?&])' + key + '[^&]*');
    // If param exists already, update it
    if (urlQueryString.match(keyRegex) !== null) {
      params = urlQueryString.replace(keyRegex, "$1" + newParam);
    } else { // Otherwise, add it to end of query string
      params = urlQueryString + '&' + newParam;
    }
  }
  window.history.replaceState({}, "", baseUrl + params);
}

function addQueryParams() {
	if (!window.history && !window.history.replaceState) {
		// replaceState not supported
		return;
	}
	// Target screensize less than 769
	// Hash Param: op=1
	if (window.innerWidth < 769) {
		updateQueryStringParam('op', 1);
	}
}

addQueryParams();