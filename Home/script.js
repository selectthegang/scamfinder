/* Variables/Libraries */
let socket = io();
let search = document.getElementById('search');
let number = document.getElementById('number');
let siteresults = document.getElementById('results');

/* Load Service Worker (PWA) */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('./js?folder=pwa&file=pwabuilder-sw').then(
			function (registration) {
				console.log(registration.scope);
			},
			function (err) {
				console.log(err);
			}
		);
	});
}

/* Listen For Clicks Of Search Button */
search.addEventListener('click', function () {
	if (number.value.length === 10) {
		socket.emit('getNumber', number.value);
	} else {
		siteresults.innerHTML = `<h3>you didn't specify a vaild phone number</h3>`;
	}
});

/* Result Socket */
socket.on('results', results => {
	siteresults.innerHTML = `<h3 class="info">${results}</h3>`;
});

/* Mobile Menu Function */
function myFunction() {
	var x = document.getElementById('navDemo');
	if (x.className.indexOf('w3-show') == -1) {
		x.className += ' w3-show';
	} else {
		x.className = x.className.replace(' w3-show', '');
	}
}