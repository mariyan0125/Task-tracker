const app = require('express')();
const ent = require("ent");
const fs = require("fs");
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let tasklist = [];


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Return JavaScript script
app.get("/js", (req, res) => {

	fs.readFile("./js/index.js", function (err, data){
		if(err){
			console.log("ERROR : " + err.message);
			res.setHeader('Content-Type', 'text/html ');
			res.status(404).send("ERROR 404 : Page Not Found");
		}
		else{
			res.setHeader('Content-Type', 'text/html');
			res.end(data);
		}
	});
})

// Return Style css 
app.get("/css", (req, res) => {

	fs.readFile("./css/style.css", function (err, data){
		if(err){
			console.log("ERROR : " + err.message);
			res.setHeader('Content-Type', 'text/html ');
			res.status(404).send("ERROR 404 : Page Not Found");
		}
		else{
			res.setHeader('Content-Type', 'text/css');
			res.end(data);
		}
	});
})


io.on('connection', function(socket){
	console.log('A user connected');
	
  
  socket.on('app users', function(user, callback){
		console.log('Users : ' + user);
		callback(true);
    io.emit('app users', user);
  });


  socket.on('hasLeft', function(user){
    console.log('Users : ' + user);
    io.emit('hasLeft', user);
  });

  
  socket.emit("tasklist", tasklist);
	socket.on("add", (p_task) => {
		tasklist.push(ent.encode(p_task));
		socket.broadcast.emit("add", tasklist[tasklist.length-1]);
	});

	socket.on("remove", (p_id) => {
		if(p_id >= 0 && p_id < tasklist.length){
			tasklist.splice(p_id, 1);
		  socket.broadcast.emit("remove", p_id);
		}

	});
	
	
	socket.on('disconnect', function(msg){
    console.log('A user disconnected');
  });

});//end of socket listeners



http.listen(process.env.PORT || 3000, function(){
  console.log('Server running ...');
});
