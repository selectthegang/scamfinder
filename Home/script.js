/* Variables */
let socket = io();
let search = document.getElementById('search');
let number = document.getElementById('number');
let siteresults = document.getElementById('results');

/* Load Service Worker (PWA) */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('./js?folder=pwa&file=pwabuilder-sw').then(
			function(registration) {
				console.log(registration.scope);
			},
			function(err) {
				console.log(err);
			}
		);
	});
}

/* Search Number When "Search" Button Is Clicked */
search.addEventListener('click', function() {
	if (number.value.length === 10) {
		socket.emit('getNumber', number.value);
	} else {
		siteresults.innerHTML = `<div class="info">you didn't specify a vaild phone number</div>`;
	}
});

/* Result Socket */
socket.on('results', results => {
	siteresults.innerHTML = `<div class="info">${results}</div>`;
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

/* Modal Stuff */
/*let modal = document.getElementById('modal');

let span = document.getElementsByClassName('close')[0];

setTimeout(function() {
	modal.style.display = 'block';
}, 2000);

span.onclick = function() {
	modal.style.display = 'none';
};

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
};*/
