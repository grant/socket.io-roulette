$(function () {
	var connected = false;
	var username = prompt('Type a username');
	var $chatInput = $('.chatInput');
	var $chatArea = $('.chatArea');

	var otherUser;

	// Init
	$chatInput.focus();

	var socket = io.connect();

	socket.on('connect', function(){
		connected = true;
		postMessage('socket.io', 'Socket Power! (Connected to server)', true);
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
	
	window.setInterval(updateBlob, 10);

	// Send new blob to server
	function updateBlob(){
		var video = document.querySelector('video');
		socket.emit('updateBlob', video.src);
	}

	// Sends message to other user
	function sendMessage (message) {
		if (connected) {
			postMessage(username, message);
			socket.emit('sendMessage', message);
		}
	}

	// Posts the message in the message area
	function postMessage (username, message, isLog) {
		var $usernameArea = $('<div/>').addClass('username').html(username);
		var $messageArea = $('<div/>').addClass('messageArea').html(message);
		var $message = $('<li/>').append([$usernameArea, $messageArea]);
		if (isLog) {
			$message.addClass('log');
		}
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
		postMessage(name, matchedMessage);
	});

});
