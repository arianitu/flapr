(function() {
function D() {
	k = [];
	c = null;
	u = !1;
	// v = "ws://162.243.44.70:2828 ws://162.243.44.70:2829 ws://162.243.44.70:2830 ws://162.243.86.251:2828 ws://162.243.86.251:2829 ws://162.243.86.251:2830 ws://107.170.21.19:2828 ws://107.170.21.19:2829 ws://107.170.21.19:2830".split(" "),
	p = "ws://127.0.0.1:5199";
	m = new WebSocket(p, "flapmmo.com");
	m.binaryType = "arraybuffer";
	m.onopen = function (a) {
		h = [];
		null != c && (w = c.x);
		u = !0;
		console.log("Socket connected");
		q()
	};
	m.onmessage = function (a) {
		console.log('on message', a);
		a = a.data;
		switch ((new DataView(a)).getUint8(0)) {
		case 0:
			x =
				(new DataView(a)).getInt32(1, !0);
			console.log(0);
			c = new player(x, [], "");
			k.push(c);
			break;
 		case 2:
			// function player(id, jumps, nick) {
			a = new DataView(a);
			E = a.getUint32(1, !0); // number of players
			// b ?
			for (var b = a.getInt32(5, !0), f = 9, r = 0; r < b; r++) {
				for (var d = a.getInt32(f, !0), f = f + 4, e = "";;) {
					var g = a.getUint8(f++);
					if (0 == g) break;
					e += String.fromCharCode(g)
				}
				for (var g = [], m = a.getUint16(f, !0), f = f + 2, l = 0; l < m; l++) 
					g.push(a.getUint16(f, !0)), f += 2;
				d != x && (d = new player(d, g, e), s.push(d))
			}
			break;
		case 3:
			for (console.log("Obstacles bytes: " + a.byteLength), 
			     a = new DataView(a), 
			     b = 1, 
			     f = a.getInt32(b, !0),
			     b += 4, r = 0; r < f; r++)
				h.push(new F(a.getInt32(b + 0, !0), 
				             a.getInt32(b + 4, !0))), b += 8
		}
	};
	m.onclose = function () {
		u = !1;
		setTimeout(D, 1E3)
	}
}

function G() {
	z = +new Date;
	var a = 1 + Math.ceil(s.length / 4);
	a > s.length && (a = s.length);
	for (; a--;) k.push(s.shift());
	for (a = 0; a < k.length; a++) k[a].think()
}

function H() {
	++A;
	z = +new Date;
	b.clearRect(0, 0, e.width, e.height);
	var a = null != c ? c.x - 100 : 0;
	d = 0 == d ? a : Math.round((d + a) / 2);
	for (a = -(Math.floor(d / 2) % 288); a < e.width;) b.drawImage(l, 0, 0, 288, 512, a, 0, 288, 512), a += 288;
	b.save();
	b.translate(-d, 0);
	for (a = 0; a < h.length; a++) h[a].draw();
	b.restore();
	for (a = -(Math.floor(d) % 336); a < e.width;) b.drawImage(l, 584, 0, 336, 111, a, 401, 336, 111), a += 336;
	var O = 0;
	b.save();
	b.translate(-d, 0);
	28 <= I ? (g += 10, 1E3 < g && (g = 1E3)) : (g -= 10, 30 > g && (g = 30));
	for (a = 0; a < k.length && !(k[a] != c && k[a].draw() && ++O > g); ++a);
	null != c && c.draw();
	b.restore();
	b.save();
	b.translate(-d, 0);
	for (a = 0; a < h.length; a++) h[a].drawOverlay();
	b.restore();
	u ? b.fillText("Score: " + P() + " | Players: " + E + " | Distance: " + (null == c ? 0 : Math.floor(c.x / 200)) + " | Server #" + (v.indexOf(p) + 1), 20, 20) : b.fillText("Connecting to server " + p.slice(5) +
			                               "...", 20, 20);
	B.clearRect(0, 0, e.width, e.height);
	B.drawImage(t, 0, 0, e.width, e.height);
	window.requestAnimationFrame(H)
}

function endTheGame() {
	null != c && (c.vx = K, c.vy = 0, L(), c.reset(), w = c.x)
}

function P() {
	if (null == c) return 0;
	for (var a = 0, b = 0; b < h.length; b++) c.x > h[b].x + 30 && ++a;
	return a
}

function player(id, jumps, nick) {
	console.log(id);
	console.log(jumps);
	console.log('the nick', nick);
	console.log(nick);

	this.id = id;
	this.reset();
	this.seed = 9999 * Math.random();
	this.nick = nick;
	this.jumps = jumps || [];
	this.playbackTime = 0
}

function F(a, b) {
	this.x = a;
	this.y = b

	console.log('---');
	console.log(this.x);
	console.log(this.y);
	console.log('---');
}

function M(a) {
	var b = k.indexOf(a); - 1 != b && (a.destroy(), k.splice(b, 1))
}

function L() {
	if (null !=
	    c && 0 != c.jumps.length) {
		var a = new ArrayBuffer(3 + 2 * c.jumps.length),
		    b = new DataView(a);
		b.setUint8(0, 2);
		b.setUint16(1, c.jumps.length, !0);
		for (var f = 3, d = 0; d < c.jumps.length; d++) b.setUint16(f, c.jumps[d], !0), f += 2;
		m.send(a);
		c.jumps.length = 0
	}
}

function q() {
	var a = n.value,
	    b = new ArrayBuffer(32),
	    f = new DataView(b);
	f.setUint8(0, 5);
	for (var d = 0; d < a.length && 16 > d; d++) {
		var e = a.charCodeAt(d);
		128 <= e || f.setUint8(d + 1, e)
	}
	null != c && (c.nick = a);
	m.send(b)
}

function N(a, b) {
	return a.x + a.r < b.x || a.y + a.r < b.y || a.x - a.r > b.x + b.width || a.y - a.r >
		b.y + b.height ? !1 : !0
}
window.onload = function () {
	n = document.getElementById("nickname");
	n.onchange = q;
	n.onkeydown = q;
	n.onkeyup = q;
	n.onkeypress = q;
	e = document.getElementById("canvas");
	B = e.getContext("2d");
	t = document.createElement("canvas");
	t.width = e.width;
	t.height = e.height;
	b = t.getContext("2d");
	endTheGame();
	D();
	G();
	H();
	setInterval(G, 1E3 / 60)
};
var e, t, b, B, l = new Image;
l.src = "atlas.png";
var d = 0,
    k = [],
    h = [],
    z = 0,
    c = null,
    C = !1,
    x = null,
    E = "?",
    w = 100,
    n, K = 2,
    m, s = [],
    A = 0,
    I = 60,
    g = 200,
    v = "ws://162.243.44.70:2828 ws://162.243.44.70:2829 ws://162.243.44.70:2830 ws://162.243.86.251:2828 ws://162.243.86.251:2829 ws://162.243.86.251:2830 ws://107.170.21.19:2828 ws://107.170.21.19:2829 ws://107.170.21.19:2830".split(" "),
    p = null,
    u = !1;
setInterval(function () {
	I = A;
	A = 0
}, 1E3);

player.prototype = {
	id: 0,
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	seed: 0,
	wasSeen: !0,
	nick: null,
	jumps: null,
	playbackTime: 0,
	gameOver: !1,
	rotation: 0,
	targetRotation: 0,
	removeTimer: -1,
	reset: function () {
		this.x = 100;
		this.y = 50;
		this.vx = K;
		this.vy = 0;
		this.jumps = [];
		this.playbackTime = 0;
		this.gameOver = 0;
		// Object.defineProperty(this, "gameOver", {
		// 	get: function() { return 1; },
		// 	set: function(y) { console.log("gameOver", y); }
		// });

		this.removeTimer = -1;
	},
	draw: function () {
		if (-100 > this.x - d || 1E3 < this.x - d) return !1;
		b.save();
		b.translate(2 * Math.floor(this.x / 2), 2 * Math.floor(this.y / 2));
		var a = Math.floor((z + this.seed) / 200) % 2;
		b.rotate(this.rotation);
		this == c ? (b.beginPath(), b.fillStyle = "rgba(255, 255, 255, 0.5)", b.arc(0, 0, 30, 0, 2 * Math.PI, !1), b.fill(), b.drawImage(l, 230, 762 + 52 * a, 34, 24, -17, -12, 34, 24)) : (b.globalAlpha *= 0.5, b.drawImage(l, 6 + 56 * a, 982, 34, 24, -17, -12, 34, 24), b.globalAlpha /= 0.5);
		b.rotate(-this.rotation);
		(a = this.nick) && h.length && this.x - 60 > h[0].x && (b.textAlign = "center", b.fillStyle = "#000000", b.fillText(a, 1, -20), b.fillText(a, -1, -20), b.fillText(a, 0, -21), b.fillText(a, 0, -19), b.fillStyle = "#FFFFFF", b.fillText(a, 0, -20));
		b.restore();
		return !0
	},
	think: function () {
		++this.playbackTime;
		for (var a = this.gameOver, b = 0; b < h.length; b++) {
			var d = h[b];
			if (d.collidesWith(this)) {
				this.gameOver = !0;
				break
			}
		}
		this.vy += 0.4;
		389 <= this.y && (this.vy = this.vx = 0, this.gameOver = !0, this == c ? L() : null == this.id && M(this));
		this.gameOver ? (this.vx = 0, 389 < this.y && (this.y = 389), this != c && (0 > this.removeTimer && (this.removeTimer = Math.floor(this.x / 10)), this.removeTimer -= 1, 0 == this.removeTimer && M(this))) : this == c ? C && (this.jumps.push(this.playbackTime), C = !1, this.vy = -8) : -1 != this.jumps.indexOf(this.playbackTime) && (this.vy = -8);
		this.x +=
		this.vx;
		this.y += this.vy;
		for (this.targetRotation = Math.atan2(this.vy, this.vx); 180 < this.targetRotation;) this.targetRotation -= 360;
		for (; - 180 > this.targetRotation;) this.targetRotation += 360;
		this.rotation = (this.rotation + this.targetRotation) / 2;
		if (!a && this.gameOver) {
			for (var a = null, e = 0, b = 0; b < h.length; b++) {
				var d = h[b],
				    g = Math.abs(d.x - this.x + 26);
				100 < g || !(null == a || g < e) || (e = g, a = d)
			}
			a && ++a.deaths
		}
	},
	setPlayback: function (a, b) {
		this != c && this.reset();
		this.jumps = a;
		b && (this.nick = b)
	},
	destroy: function () {}
};
F.prototype = {
	x: 0,
	y: 0,
	deaths: 0,
	getHeight: function () {
		return 124
	},
	draw: function () {
			-300 > this.x - d || 1200 < this.x - d || (this.isValid() || (b.globalAlpha *= 0.5), b.drawImage(l, 112, 646, 52, 320, this.x, this.y - 320, 52, 320), b.drawImage(l, 168, 646, 52, 320, this.x, this.y + this.getHeight(), 52, 320), this.isValid() || (b.globalAlpha /= 0.5))
	},
	drawOverlay: function () {
		if (!(-300 > this.x - d || 1200 < this.x - d)) {
			b.save();
			b.translate(this.x + 26, 415);
			var a = this.deaths.toString();
			b.textAlign = "center";
			b.fillStyle = "#000000";
			b.fillText(a, 1, 0);
			b.fillText(a, -1, 0);
			b.fillText(a,
			           0, -1);
			b.fillText(a, 0, 1);
			b.fillStyle = "#FFFFFF";
			b.fillText(a, 0, 0);
			b.restore()
		}
	},
	collidesWith: function (a) {
		return this.isValid() ? N({
			x: a.x,
			y: a.y,
			r: 12
		}, {
			x: this.x,
			y: this.y - 320,
			width: 52,
			height: 320
		}) || N({
			x: a.x,
			y: a.y,
			r: 12
		}, {
			x: this.x,
			y: this.y + this.getHeight(),
			width: 52,
			height: 320
		}) : !1
	},
	isValid: function () {
		return this.x > w + 200
	}
};
document.body.onkeydown = document.body.ontouchstart = function (a) {
	null != c && c.gameOver && 389 <= c.y ? endTheGame() : null != c && 0 < c.y && (C = !0)
};
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || function (a) {
		setTimeout(a, 1E3 / 60)
	}
})();
