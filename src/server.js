var http = require('http'),
fs = require('fs'),
index = fs.readFileSync(__dirname + '/../build/index.html');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var open = require('open');

app.use(express.static(__dirname + '/../build'))
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/../build/index.html');
});

// Socket.io server listens to our app
// var io = require('socket.io').listen(app);
var DEFAULT_TIME = 45;
// lista cu clientii curenti
var clients_ids = [];
var players_names = {};
var raspunsuri = {};
var numar_voturi_gata = 0;
var scoruri = {};
var runde = 5;
var setMaster = true;
var master_id;
var timer = DEFAULT_TIME;

var question_base = JSON.parse(fs.readFileSync(__dirname + '/questions.json'));
question_base = question_base.normal;
//console.log(question_base);
var ipaddr = require("ip");
console.log(ipaddr.address());
var ip = ipaddr.address();

// Send current time to all connected clients
function sendClientsList() {
    io.emit('client list', { time: clients_ids });
}

function select_5questions() {
	var selected_questions = [];

	for (var  i = 0; i < 5; ++i) {
		var idx = getRandomArbitrary(0, question_base.length);
		selected_questions.push(question_base[idx]);
	}

	return selected_questions;
}

var questions = select_5questions();
var question;

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function maxim() {
	var max = 0;
	var id_castigator = "";
	for (var i = 0; i < clients_ids.length; ++i) {
		if (scoruri[clients_ids[i]] > max) {
			max = scoruri[clients_ids[i]];
			id_castigator = clients_ids[i];
		}
	}
	return id_castigator;
}


var amount = 0;

function async_timer_update() {
	//console.log(timer);
	timer += amount;
	if (timer < 0)
		return;
	io.sockets.emit('update clock', {time: timer});
	//setTimeout(async_timer_update, 1000);
}


io.on('connection', function(socket) {
	socket.emit('your role', {isMaster: setMaster});
	setMaster = false;

    socket.emit('welcome', {id: socket.id, ip: ip});

	// asa pot sa afisez ce socket s-a deconectat ... scot si din lista de clienti curenti
	socket.on('disconnect', function(){
		var index = clients_ids.indexOf(socket.id);
		clients_ids.splice(index, 1);
		console.log('user disconnected: ' + players_names[socket.id] + "..." + socket.id);
	});

	// aici scrie ce a primit de la client ... adica clientul ii trimite inapoi id-ul sau cand se conecteaza
	// asta este doar de forma ca sa se confirme ca clientul s-a conectat bine ... si sa fac lista de clienti
	// care o sa inceapa sa se joace ... dupa ce toti au dat start joc ... si au introdus nume
    socket.on('i am client', function(data) {
		clients_ids.push(data.id);
		console.log("clientul " + data.id + " a confirmat conectarea");

		io.to(clients_ids[0]).emit('player numbers update',
			{connectedPlayers: clients_ids.length - 1, readyPlayers: Object.keys(players_names).length});
	});
	
	socket.on('start', function(data) {
		players_names[data.id] = data.name;
		scoruri[data.id] = 0;
		console.log("Client id#" + data.id + " nume#" + data.name + " este gata.");
		console.log("Avem ids#"+ clients_ids.length + " names#" + Object.keys(players_names).length);

		io.to(clients_ids[0]).emit('player numbers update',
			{connectedPlayers: clients_ids.length - 1, readyPlayers: Object.keys(players_names).length});

		if (Object.keys(players_names).length == clients_ids.length - 1 && clients_ids.length >= 3) {
			choose_domain();
			amount = -1;
			//async_timer_update();
		}
	});
	
	function choose_domain() {
		var randomIndex = getRandomArbitrary(1, clients_ids.length);
		timer = DEFAULT_TIME;
		console.log("Acum se alege domeniul de catre "  + players_names[clients_ids[randomIndex]]);

		//domains = ["alegeri-electorale-sua", "bucatarie franceza", "injuraturi neaose", "inca un domeniu sa fie"]
		//domains = question_base.normal.category;
		domains = questions.map(function(argument) {
			return argument.category;
		});
		console.log("Domeniile sunt: ... " + domains);
		io.to(clients_ids[randomIndex]).emit('alege domeniu', {message: domains});
		io.to(clients_ids[0]).emit('alege domeniu', {time: timer, message: domains, currentPlayer:players_names[clients_ids[randomIndex]]});
	}
	
	socket.on('am ales domeniul', function(data) {
		console.log("S-a ales domeniul: " + data.category); 
		for (var q of questions) {
			if (q.category === data.category) {
				question = q;
				question.question = question.question.replace('<BLANK>', '______');
				break;
			}
		}

		timer = DEFAULT_TIME;
		io.sockets.emit('raspunde la intrebare', {time: timer, message: question.question});
		//for (client_id of clients_ids)
		//	raspunsuri[client_id] = question.suggestions[getRandomArbitrary(0, question.suggestions.length)];
		
		//question = "";
	});
	
	socket.on('raspuns dat', function(data) {
		if (data.raspuns === null)
			data.raspuns = question.suggestions[getRandomArbitrary(0, question.suggestions.length)];
		raspunsuri[socket.id] = data.raspuns;
		console.log("Raspuns primit: " + data.raspuns);
		if (Object.keys(raspunsuri).length == clients_ids.length - 1) {
			console.log("S-au primit toate raspunsurile ... acum trebuie sa se voteze");
			// daca s-au dat toate raspunsurile ... sa vedem cate voturi primeste fiecare raspuns
			// dau clientilor raspunsurile celorlalti si ei imi trimit inapoi unul dintre ele:
			timer = DEFAULT_TIME;
			for (var i = 0; i < clients_ids.length; i++) { // pentru fiecare jucator in parte
				var lista = []; // ii creez o lista de raspunsuri
				for (var key in raspunsuri) {
					if (key != clients_ids[i]) {
						lista.push(raspunsuri[key]);
					}
				}
				lista.push(question.answer);
				io.to(clients_ids[i]).emit('voteaza', {time: timer, answers: lista});
			}
		}
	});
	
	socket.on('votare gata', function(data) {
		numar_voturi_gata = numar_voturi_gata + 1;
		console.log(players_names[socket.id] + " a votat: " + data.raspuns);
		for (var key in raspunsuri) {
			if (raspunsuri[key] == data.raspuns) {
				scoruri[key] = scoruri[key] + 1;
			}
		}
		if (numar_voturi_gata == clients_ids.length - 1) {
			raspunsuri = {};
			console.log("S-a terminat votarea.");
			timer = DEFAULT_TIME;

			var scores = [];
			for (var idx  = 1; idx < clients_ids.length; idx++) {
				var client_id = clients_ids[idx];
				scores.push({player_name : players_names[client_id], player_score : scoruri[client_id]});
			}
			scores.sort(function(a, b) {
				return b.player_score - a.player_score;
			});
			console.log(scores);
			
			io.to(clients_ids[0]).emit('score', {score : scores});

			numar_voturi_gata = 0;
			runde = runde - 1;
			if (runde > 0) {

				setTimeout(function() {
					questions = select_5questions();
					choose_domain();
				}, 8000);
			}
		}
	});
		
});

server.listen(3000);
open('http://localhost:3000/');
//

setInterval(async_timer_update, 1000);