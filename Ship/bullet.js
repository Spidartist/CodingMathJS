var bullet = {
    x: 0,
	y: 0,
    vx: 0,
    vy: 0,

	create: function(x, y, speed, direction) {
		var obj = Object.create(this);
		obj.x = x;
        obj.y = y;
        obj.vx = Math.cos(direction) * speed;
		obj.vy = Math.sin(direction) * speed;
		return obj;
	},

	update: function() {
		this.x += this.vx;
        this.y += this.vy;
	}
}