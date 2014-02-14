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

var packets = require('./packets');
var obstacles = require('./obstacles');

function Room() {
	
	this.playerById = {};

};

Room.prototype.add = function add(player) {
	
	this.playerById[player.id] = player;
	player.ws.send(packets.getIdentifierPacket(player));
	player.ws.send(packets.getObstaclesPacket(obstacles));
	this.tick();

};

Room.prototype.getPlayer = function getPlayer(playerId) {
	
	return this.playerById[playerId];
	
};

Room.prototype.tick = function tick() {
	
	var updatePacket = packets.getUpdatePacket(this.playerById);
	this.broadcast(updatePacket);

};

Room.prototype.remove = function remove(playerId) {

	delete this.playerById[playerId];
	this.tick();

};

Room.prototype.broadcast = function broadcast(packet) {

	var arrPlayerKeys = Object.keys(this.playerById);
	for (var idxPlayerKey = 0; idxPlayerKey < arrPlayerKeys.length; idxPlayerKey++) {
		var playerKey = arrPlayerKeys[idxPlayerKey];
		var player = this.playerById[playerKey];

		player.ws.send(packet);
	}
};

module.exports = new Room();

