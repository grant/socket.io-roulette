$(function () {
	var username = prompt('Type a username');
	var $chatInput = $('.chatInput');
	var $chatArea = $('.chatArea');

	var otherUser;

	// Init
	$chatInput.focus();
	var socket = io.connect('https://localhost');

	socket.on('connect', function(){
		sendMessage('socket.io', 'Socket Power!');
		socket.emit('addUser', username);

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
			socket.emit('sendMessage', username, message);
		}

		function postMessage (username, message) {
			var $usernameArea = $('<div/>').addClass('username').html(username);
			var $messageArea = $('<div/>').addClass('messageArea').html(message);
			var $message = $('<li/>').append([$usernameArea, $messageArea]);
			$chatArea.find('.messages').append($message);

			// Scroll to bot
			$chatArea[0].scrollTop = $chatArea[0].scrollHeight;
		}

		// post messages sent by otherUser
		socket.on('newMessage', function(data) {
			postMessage(otherUser, data);
		});

		// let user know who he just connected with
		socket.on('matched', function(name) {
			otherUser = name;
			var matchedMessage = "You have been matched with " + otherUser + "!!!";


		});

	});
});