let socket = io();
let sendbtn = document.getElementById('sendbtn');
let message = document.getElementById('message');
let result = document.getElementById('result');

sendbtn.addEventListener('click', function() {
	if (message.value.length < 5) {
		result.innerHTML = '<div class="info">feedback messages must contain 5 characters or more!</div>';
	} else {
		socket.emit('feedback', message.value);
		result.innerHTML = '<div class="info">submitted feedback...</div>';
	}
});