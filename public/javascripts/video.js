var userStream;

function addOwnSrc(video){
	if (!userStream) {
		getUserStream(function () {
            // Retry
            addVideoSrc(video);
        });
	} else {
		addVideoSrc(video, userStream);
	}
}

// video is a video element
function addVideoSrc (video, stream) {
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
        // video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    video.play();
}

function getUserStream (callback) {
    function successCallback(stream) {
        userStream = stream;
        callback();
    }

    function errorCallback(error) {
        console.error('An error occurred: [CODE ' + error.code + ']');
        // Display a friendly "sorry" message to the user
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    // Call the getUserMedia method with our callback functions
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, successCallback, errorCallback);
    } else {
        console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
    }
}
