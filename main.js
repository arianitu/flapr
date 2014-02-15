#!/usr/bin/env node

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var g_port          = 5199;
var g_playerId      = 1;
var WebSocketServer = require('ws').Server;
var Room            = require('./room');
var Player          = require('./player');
var domain          = require('domain').create();

domain.on('error', function printDomainError(error){
	console.error("Domain caught an error:");
	console.error(error);
});

console.log("Starting FlapMMO server on port: " +  g_port);
var wss             = new WebSocketServer({ port: g_port });

domain.run(runServer);
function runServer() {
	wss.on('connection', function setupConnection(ws) {
		ws.on('message', function handleMessage(message) {
			var messageType = message.readUInt8(0);
			switch(messageType) {
			case 5:	
				if (ws.playerId) {
					var player = Room.getPlayer(ws.playerId);
					var nick = "";
					for (var i = 1; i < message.length; i++) {
						var charCode = message.readUInt8(i);
						if (charCode === 0) {
							break;
						}
						nick += String.fromCharCode(charCode);
					}
					player.nick = nick;
					return;
				}

				var player = new Player(g_playerId, ws);
				ws.playerId = g_playerId++;
				g_playerId = g_playerId % 1000000000;

				Room.add(player);
				break;

			case 2:
				if (! ws.playerId) {
					return;
				}

				var player = Room.getPlayer(ws.playerId);
				if (! player) {
					return;
				}

				var bufferIndex = 1;
				var numberOfJumps = message.readUInt16LE(bufferIndex); bufferIndex += 2;
				var jumps = [];
				for (var i = 0; i < numberOfJumps; i++) {
					var jump = message.readUInt16LE(bufferIndex); bufferIndex += 2;
					jumps.push(jump);
				}

				player.jumps = jumps;
				Room.tick();

				break;
			}
		});
		ws.on('error', function printError(error) {
			console.error("A websocket encountered an error");
			console.error(error);
		});
			
		ws.on('close', function removeFromRoom() {
			Room.remove(ws.playerId);
		});
	});

	wss.on('error', function printError(error) {
		console.error("Websocket server encountered an error:");
		console.error(error);
	});
}
