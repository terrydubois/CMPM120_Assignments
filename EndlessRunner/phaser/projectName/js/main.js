var game = new Phaser.Game(1152, 648, Phaser.AUTO);

// declare some variables
var player;
var playerPos;
var playerXStart;
var playerYStart;
var playerXDest;
var cursors;
var playerGroup;
var livesGroup;
var score;
var maxSpawn;
var spawnRate;
var lives;
var yOffset;

// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	
		// load game sprites
		//sup
		game.load.image('sky', 'assets/img/skysun.png');
		game.load.image('ground', 'assets/img/groundnew.png');
		game.load.image('bluedot', 'assets/img/cone.png');
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.image('dog', 'assets/img/dog.png');
		game.load.image('guy', 'assets/img/motorcycle.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
		game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
		
		// load pop sound
		game.load.audio('popsound', 'assets/audio/pop.mp3');

		// align game to center of screen
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();
	},
	create: function() {
		console.log('MainMenu: create');

		// main menu text and instructions
		var titleText = game.add.text(16, 100, "terry's endless runner", {fontSize: '32px', file: '#000'});
		var subtitleText = game.add.text(16, 150, "Press SPACE to start", {fontSize: '32px', file: '#000'});
		titleText.addColor("#ff0000", 0); //red
		subtitleText.addColor("#ff0000", 0); //red

	},
	update: function() {
		// main menu logic
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
	}
}

// define gameplay state and methods
var Play = function(game) {};
Play.prototype = {
	init: function() {
		console.log('Play: init');
		game.score = 0;
		game.lives = 3;
		game.spawnRate = 1.5;
	},
	preload: function() {
		console.log('Play: preload');
	},
	create: function() {
		console.log('Play: create');

		// add background & foreground assets
		bgSprite = game.add.sprite(0, 0, 'sky');
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');

		// draw score text
		scoreText = game.add.text(16, 16, '0', {font: 'Trebuchet MS', fontStyle: 'italic', fontSize: '60px', fill: '#facade', align: 'left'});
		livesText = game.add.text(16, 60, 'Lives: 0', {font: 'Trebuchet MS', fontStyle: 'italic', fontSize: '60px', fill: '#facade', align: 'left'});
		//spawnText = game.add.text(16, 120, 'spawnRate: 0', {font: 'Trebuchet MS', fontStyle: 'italic', fontSize: '20px', fill: '#facade', align: 'left'});

		// initialize some variables
		game.score = 0;
		game.lives = 3;
		livesGroup = game.add.group();
		playerPos = 0;
		yOffset = 0;
		playerXStart = 180;
		playerYStart = game.world.height - 150;
		maxSpawn = 3;

		// add player
		player = game.add.sprite(playerXStart, playerYStart, 'guy');
		playerGroup = game.add.group();
		playerGroup.add(player);

		// add physics to Phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(groundSprite);
		game.physics.arcade.enable(bgSprite);




		
		cursors = game.input.keyboard.createCursorKeys();

		// set timer to spawn obstacles
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnAvoids, this);

	},
	update: function() {

		// custom camera shake (so that I can shake only the Y, not the X)
		yOffset = approach(yOffset, 0, 12);
		var relativeYOffset = Math.random() * yOffset;
		if (yOffset > 3) {
			if (Math.random() > 0.5) {
				relativeYOffset *= -1;
			}
			groundSprite.body.y = (game.world.height / 2) + relativeYOffset;
			bgSprite.body.y = relativeYOffset;
			scoreText.y = 16 + relativeYOffset;
			livesText.y = 60 + relativeYOffset;
		}
		else {
			groundSprite.body.y = (game.world.height / 2);
			bgSprite.body.y = 0;
			scoreText.y = 16;
			livesText.y = 60;
		}

		scoreText.text = game.score;
		livesText.text = "Lives: " + game.lives;
		//spawnText.text = "spawnRate: " + game.spawnRate;
		changeSpawnRate();

		// makes it so player is always on top layer
		game.world.bringToTop(playerGroup);

		// keyboard input
		if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && playerPos > 0
		&& player.body.y >= playerYStart - 2) {
			playerPos--;
		}
		else if (game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && playerPos < 2
		&& player.body.y >= playerYStart - 2) {
			playerPos++;
		}

		// update player's x position
		playerXDest = playerXStart + (playerPos * 160);
		player.body.x = approach(player.body.x, playerXDest, 8);

		if (player.body.y >= playerYStart - 2) {
			player.body.gravity.y = 0;
			player.body.velocity.y = 0;
			player.body.y = playerYStart - 2 + relativeYOffset + (Math.random() * 3);
		}
		else {
			player.body.gravity.y = 1200;
		}

		if ((game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.UP))
		&& (player.body.y >= playerYStart - 2)) {
			player.body.velocity.y = -350;
		}
	}
}

// define gameover state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		console.log('GameOver: preload');
	},
	create: function() {
		console.log('GameOver: create');

		// display text on gameover screen
		var gameoverText1 = game.add.text(16, 100, "GAME OVER!", {fontSize: '32px', file: '#000'});
		var gameoverText2 = game.add.text(16, 150, "Your final score: " + game.score, {fontSize: '32px', file: '#000'});
		var gameoverText3 = game.add.text(16, 200, 'Press SPACE to restart!', {fontSize: '32px', file: '#000'});
		gameoverText1.addColor("#ff0000", 0); //red
		gameoverText2.addColor("#ff0000", 0); //red
		gameoverText3.addColor("#ff0000", 0); //red
	},
	update: function() {
		// restart game if SPACE is pressed
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('MainMenu');
		}
	}
}

// add states to StateManager
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');




function clamp(value, min, max) {

	// clamp value between min and max, used for diamond positioning
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}

function approach(value, valueDest, rate) {

	// smoothly have one value approach another value
	if (value < valueDest) {
		value += Math.abs(value - valueDest) / rate;
	}
	else if (value > valueDest) {
		value -= Math.abs(value - valueDest) / rate;
	}

	return value;
}

function spawnAvoids() {

	var laneList = [];	
	for (var i = 0; i < maxSpawn; i++) {

		var currentLane = Math.floor(Math.random() * 3);
		var indexInList = -1;

		// check to make sure we don't spawn more than 1
		// obstale in the same lane
		for (var j = 0; j < laneList.length; j++) {
			if (laneList[j] == currentLane) {
				indexInList = j;
			}
		}
		
		// spawn new obstacle. add it to laneList for next check
		if (indexInList < 0) {
			this.enemy = new Avoid(game, 'bluedot', 'bluedot', 0.2, 0, currentLane, playerYStart + 80);	
			game.add.existing(this.enemy);
			laneList.push(currentLane);
		}
	}
	
	game.score++;

	// call this function again
	game.time.events.repeat(Phaser.Timer.SECOND * game.spawnRate, 1, spawnAvoids, this);
}

function collisionTest(pos) {

	// decrement lives if player hits an obstacle
	if (pos == playerPos && player.body.y >= playerYStart - 2) {
		game.lives--;
		yOffset = 30;
		//game.camera.shake(0.005, 200);
	}

	if (game.lives <= 0) {
		game.lives = 0;
		game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 1, endGame, this);
	}
}

function changeSpawnRate() {

	// decrease time between spawns as player scores go up
	if (game.score < 10) {
		game.spawnRate = 1.6;
	}
	else if (game.score < 20) {
		game.spawnRate = 1.5;
	}
	else if (game.score < 30) {
		game.spawnRate = 1.25;
	}
	else if (game.score < 45) {
		game.spawnRate = 1;
	}
	else if (game.score < 60) {
		game.spawnRate = 0.75;
	}
	else if (game.score < 120) {
		game.spawnRate = 0.65;
	}
}

function endGame() {
	game.state.start("GameOver");
}