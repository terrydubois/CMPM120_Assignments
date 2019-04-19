// snowflake constructor
function Snowflake(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, game.rnd.integerInRange(64, game.width - 64), game.rnd.integerInRange(64, game.height - 64), key, frame);

	// set anchor point, scale, rotation for this snowflake
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 0.5;

	// set velocity of this snowflake
	this.xVelocity = 200 * Math.random();
	this.yVelocity = (200 * Math.random()) + 10;

	this.canPressR = true;

	game.physics.enable(this);
}

Snowflake.prototype = Object.create(Phaser.Sprite.prototype);
Snowflake.prototype.constructor = Snowflake;

// override Snowflake update function
Snowflake.prototype.update = function() {

	// rotate snowflake
	this.body.angularVelocity = -10;

	// make snowflake drift
	this.body.velocity.x = this.xVelocity;
	this.body.velocity.y = this.yVelocity;

	// reverse horizonal velocity if "R" is pressed
	if (game.input.keyboard.isDown(Phaser.KeyCode.R) && this.canPressR) {
	//if (this.flipKey.justPressed(250))
		this.xVelocity = -this.xVelocity;
		this.canPressR = false;
	}
	if (!game.input.keyboard.isDown(Phaser.KeyCode.R) && !this.canPressR) {
		this.canPressR = true;
	}
	

	// make this snowflake wrap around screen
	if (this.body.x > game.world.width + 50) {
		this.body.x = game.world.width * Math.random();
		this.body.y = -100;
	}
	if (this.body.y > game.world.height + 50) {
		this.body.x = game.world.width * Math.random();
		this.body.y = -100;
	}
	if (this.body.x < -50) {
		this.body.x = game.world.width + 100;
	}
}