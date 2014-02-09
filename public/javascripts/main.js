$(function () {
	var connected = false;
	var videos = [];
	var $videos = $('.videos');

	var socket = io.connect();
	socket.on('connect', function(){
		connected = true;
		// socket.emit('addUser', username);
	});

	$(window).click(function () {
		addVideo();
	});
	
	window.setInterval(updateBlob, 10);

	// Send new blob to server
	function updateBlob(){
		var video = document.querySelector('video');
		socket.emit('updateBlob', video.src);
	}

	function addVideo () {
		// Create video element
		var $video = $('<video/>').addClass('videoFrame');
		videos.push($video);

		// Reconstruct table
		$videos.find('tbody').empty();
		var videoRatioData = getVideoRatioData(videos.length);
		var numRows = videoRatioData.length;
		var vidWidth = (100/videoRatioData[numRows - 1]) + '%';
		var vidIndex = 0;
		for (var i = 0; i < numRows; ++i) {
			var $tr = $('<tr/>').css({
				height: (100/numRows) + '%'
			});
			var numCols = videoRatioData[i];
			for (var j = 0; j < numCols; ++j) {
				var vid = videos[vidIndex];
				vid.css({
					width: vidWidth
				});
				$tr.append(vid);
				++vidIndex;
			}
			$videos.find('tbody').append($tr);
		}
	}

	function removeVideo () {

	}

	var addRowVidNumbers = [3, 7, 10, 17, 25, 33, 45]; // The number of videos needed before adding a row
	function getVideoRatioData (numVideos) {
		var numRows = getNumRows(numVideos);
		var numCols = getNumCols(numRows, numVideos);
		return numCols;
	}

	function getNumRows (numVideos) {
		var numRows = 1;
		var i = 0;
		while (i < addRowVidNumbers.length && addRowVidNumbers[i] <= numVideos) {
			++numRows;
			++i;
		}
		return numRows;
	}

	function getNumCols (numRows, numVideos) {
		var colNumMap = [];

		var vidsLeft = numVideos;
		var currRow = numRows - 1;
		while (vidsLeft) {
			var vidsOnThisRow = Math.ceil(vidsLeft/(currRow + 1));
			vidsLeft -= vidsOnThisRow;
			colNumMap[currRow] = vidsOnThisRow;
			--currRow;
		}
		return colNumMap;
	}

	// Events
	// $(window).keypress(function (e) {
	// 	var enter = e.keyCode === 13; // Enter
	// 	if (enter) {
	// 		var text = $chatInput.val();
	// 		$chatInput.val('');
	// 		sendMessage(text);
	// 	}
	// });

	// let user know who he just connected with
	socket.on('matched', function(name) {
		otherUser = name;
		var matchedMessage = "You have been matched with " + otherUser + "!!!";
		postMessage(name, matchedMessage);
	});

});
