var mongoose = require('mongoose'),
	express = require('express'),
	app = express(),
	path = require('path'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

let port = 65080;
mongoose.connect('mongodb://localhost/twitteranalizer');
app.use(express.static('public'));

require('./app/controller/twitter.js')(io,app);

app.get('/', function(req, res) {
	//res.send('hello world');
	res.sendFile(path.join(__dirname,'public','index.html'));
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});