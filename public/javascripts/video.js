window.addEventListener('DOMContentLoaded', function() {

    var video = document.querySelector('video');

    function successCallback(stream) {
        // Set the source of the video element with the stream from the camera
        if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        video.play();
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
}, false);