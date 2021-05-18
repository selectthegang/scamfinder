let socket = io();
let number = document.getElementById('number');
let category = document.getElementById('type');
let btn = document.getElementById('btn');
let msg = document.getElementById('msg');

btn.addEventListener('click', function() {
	if (category.options[category.selectedIndex].text === 'Scam Category') {
		msg.innerHTML = `<div class="info">you didn't specify the scam category</div>`;
	} else {
		if (number.value.length === 10) {
			socket.emit(
				'report',
				number.value,
				category.options[category.selectedIndex].text
			);
			msg.innerHTML = `<div class="info">thanks for reporting!</div>`;
		} else {
			msg.innerHTML = `<div class="info">you didn't specify a vaild phone number</div>`;
		}
	}
});

function myFunction() {
	var x = document.getElementById('navDemo');
	if (x.className.indexOf('w3-show') == -1) {
		x.className += ' w3-show';
	} else {
		x.className = x.className.replace(' w3-show', '');
	}
}
