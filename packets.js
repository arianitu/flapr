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

module.exports = {

	getIdentifierPacket: function getIdentifierPacket(player) {
		var message = new Buffer(5);
		message.writeUInt8(0, 0);
		message.writeInt32LE(player.id, 1);
		return message;
	},

	getObstaclesPacket: function getObstaclesPacket(obstacles) {

		var bufferLength = obstacles.length * 8 + 1 + 4; // 1 for header, 4 for # of obstacles
		var bufferIndex = 0;
		var message = new Buffer(bufferLength);
		message.writeUInt8(3, bufferIndex++);
		message.writeInt32LE(obstacles.length, bufferIndex); bufferIndex += 4;

		for (var idxObstacle = 0; idxObstacle < obstacles.length; idxObstacle++) {
			var obstacle = obstacles[idxObstacle];
			message.writeInt32LE(obstacle.x, bufferIndex); bufferIndex += 4;
			message.writeInt32LE(obstacle.y, bufferIndex); bufferIndex += 4;
		}
		return message;
	},

	getUpdatePacket: function getUpdatePacket(playerById) {
		
		var arrPlayerIds = Object.keys(playerById);
		var totalNickLength = 0;
		var totalJumps = 0;
		var numberOfUpdates = 0;
		for (var idxPlayerId = 0; idxPlayerId < arrPlayerIds.length; idxPlayerId++) {
			var playerId = arrPlayerIds[idxPlayerId];
			var player = playerById[playerId];

			if (player.jumps.length > 0) {
				numberOfUpdates++;
			}

			totalNickLength += player.nick.length;
			totalJumps += player.jumps.length;
		}

		var bufferIndex = 0;

		// 1: header
		// 4: number of players
		// 4: number of updates
		// 4: playerId
		// 2: number of jumps
		// 1: end of nick
		// 2: size of each jump
		var bufferLength = 1 + 4 + 4 + (arrPlayerIds.length * (4 + 2 + 1)) + totalNickLength + (totalJumps * 2);
		var message = new Buffer(bufferLength);

		message.writeUInt8(2, bufferIndex); bufferIndex += 1;
		message.writeUInt32LE(arrPlayerIds.length, bufferIndex); bufferIndex += 4;
		message.writeInt32LE(numberOfUpdates, bufferIndex); bufferIndex += 4;

		for (var idxPlayerId = 0; idxPlayerId < arrPlayerIds.length; idxPlayerId++) {
			var playerId = arrPlayerIds[idxPlayerId];
			var player = playerById[playerId];
			
			if (player.jumps.length < 1) {
				continue;
			}

			message.writeInt32LE(player.id, bufferIndex); bufferIndex += 4;
			// write the nick if length > 0
			for (var i = 0; i < player.nick.length; i++) {
				message.writeUInt8(player.nick.charCodeAt(i), bufferIndex); bufferIndex += 1;
			}
			message.writeUInt8(0, bufferIndex); bufferIndex += 1;

			var numberOfJumps = player.jumps.length;
			message.writeUInt16LE(numberOfJumps, bufferIndex); bufferIndex += 2;
			for (var idxJump = 0; idxJump < numberOfJumps; idxJump++) {
				var jump = player.jumps[idxJump];
				message.writeUInt16LE(jump, bufferIndex); bufferIndex += 2;
			}

			// clear out the jump deltas as they've been sent off.
			player.jump = [];
		}
		return message;
	}
	
};

