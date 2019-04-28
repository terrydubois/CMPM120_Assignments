// avoid constructor
function Avoid(game, key, frame, scale, rotation, pos, criticalY) {

	this.pos = pos;

	// set xy position of this
	var xPos = 900 + (this.pos * 3);
	var yPos = game.world.height / 2;

	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	// set anchor point, scale, rotation for this obstacle
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
	this.criticalY = criticalY;
	this.givenScore = false;
	this.testedCollision = false;
	this.game = game;

	// set velocity of this
	this.xVelocity = -175 + (this.pos * 50);
	this.yVelocity = 50;

	this.rate = 0;
	this.maxRate = 2;

	game.physics.enable(this);
}

Avoid.prototype = Object.create(Phaser.Sprite.prototype);
Avoid.prototype.constructor = Avoid;

// override avoid update function
Avoid.prototype.update = function() {

	// increase rate to mimic perspective
	if (this.rate < this.maxRate) {
		this.rate += 0.005;
	}
	else {
		this.rate = this.maxRate;
	}

	// make this move forward
	this.body.velocity.x = this.xVelocity;
	this.body.velocity.y = this.yVelocity;

	// grow scale of star
	if (this.scale.x < 1) {
		this.scale.x += this.rate / 20;
	}
	else {
		this.scale.x = 1;
	}
	this.scale.y = this.scale.x;


	// change velocity of star
	this.xVelocity -= this.rate * (25 - (this.pos * 3));
	this.yVelocity += this.rate * 15;

	// test collision if at critical Y position
	if (this.body.y >= this.criticalY && !this.testedCollision) {
		this.testedCollision = true;
		collisionTest(this.pos);
	}
	
	// destroy this obstacle if it is out of bounds
	if (this.body.y > game.world.height + 50) {
		this.kill();
	}
}