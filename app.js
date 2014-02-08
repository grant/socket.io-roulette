var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// Chat Rooms


var waiter;
// {
// 	name:
// 	socket:
// }

io.sockets.on('connection', function(socket) {
	// Adds a new user to the system
	socket.on('addUser', function(username) {

		if (!waiter) {
			waiter = {
				name: username,
				socket: socket
			};
		} else {
			// connect user1 to waiter
			socket.partner = waiter.socket;
			// Waiter to user1
			waiter.socket.partner = socket;

			socket.emit('matched', waiter.name);
			waiter.socket.emit('matched', username);
		}
	});

	socket.on('sendMessage', function(message) {
		if (socket.partner) {
			socket.partner.emit('newMessage', message);
		} else {
			console.error('Error: Trying to send a message without a partner');
		}
	});

	// socket.on('disconnect', function() {

	// });
});