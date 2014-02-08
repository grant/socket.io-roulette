$(function () {
	var username = prompt('Type a username');
	var $chatInput = $('.chatInput');
	var $chatArea = $('.chatArea');

	// Init
	$chatInput.focus();
	var socket = io.connect('//0.0.0.0:3000');
	socket.on('connect', function(){
		console.log('hi');
		sendMessage('socket.io', 'Socket Power!');
		socket.emit('addUser', username);
	});

	// Events
	$(window).keypress(function (e) {
		var enter = e.keyCode === 13; // Enter
		if (enter) {
			var text = $chatInput.val();
			$chatInput.val('');
			sendMessage(text);
		}
	});

	$(window).click(function () {
		$chatInput.focus();
	});


	// Sends message to other user
	function sendMessage (message) {
		// Socketio stuff
		postMessage(username, message);

	}

	function postMessage (username, message) {
		var $usernameArea = $('<div/>').addClass('username').html(username);
		var $messageArea = $('<div/>').addClass('messageArea').html(message);
		var $message = $('<li/>').append([$usernameArea, $messageArea]);
		$chatArea.find('.messages').append($message);

		// Scroll to bot
		$chatArea[0].scrollTop = $chatArea[0].scrollHeight;
	}
});