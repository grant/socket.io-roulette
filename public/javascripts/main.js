$(function () {
	var connected = false;
	var videos = [];
	var $videos = $('.videos');

	var socket = io.connect();
	socket.on('connect', function(){
		connected = true;
		// socket.emit('addUser', username);
	});

	addVideo();
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
		addOwnSrc($video[0]);
		videos.push($video);

		createVidTable();
	}

	function createVidTable () {
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
		videos.pop();
		$videos.find('video').last().remove();
		createVidTable();
	}

	function getVideoRatioData (numVideos) {
		var numRows = getNumRows(numVideos);
		var numCols = getNumCols(numRows, numVideos);
		return numCols;
	}

	function getNumRows (numVideos) {
		var addRowVidNumbers = [3, 7, 13, 25, 36, 49, 57, 89]; // The number of videos needed before adding a row
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
});
