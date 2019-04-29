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
var frontDecorGroup;
var palmSide;
var score;
var maxSpawn;
var spawnRate;
var lives;
var yOffset;
var titlePlusY;

// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	
		// load game sprites
		game.load.image('sky', 'assets/img/skysun.png');
		game.load.image('ground', 'assets/img/groundnew.png');
		game.load.image('cone', 'assets/img/cone.png');
		//game.load.image('guy', 'assets/img/motorcycle.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.image('palm', 'assets/img/palm.png');
		game.load.image('title', 'assets/img/title.png');
		game.load.image('gameover', 'assets/img/gameover.png');
		
		// load sounds
		game.load.audio('hitSound', 'assets/audio/hit.mp3');
		game.load.audio('pointSound', 'assets/audio/point.mp3');
		game.load.audio('motorcycleSound', 'assets/audio/motorcycle.mp3');
		game.load.audio('scootLeftSound', 'assets/audio/scootLeft.mp3');
		game.load.audio('scootRightSound', 'assets/audio/scootRight.mp3');
		game.load.audio('jumpSound', 'assets/audio/jump.mp3');
		game.load.audio('music', 'assets/audio/music.mp3');

		// align game to center of screen
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();

		game.load.atlas('guy', 'assets/img/textureatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	},
	create: function() {
		console.log('MainMenu: create');

		// main menu text and instructions
		titlePlusY = 600;
		pressedSpace = false;
		bgSprite = game.add.sprite(0, 0, 'sky');
		titleSprite = game.add.sprite(90, 60 + titlePlusY, 'title');
		subtitleText = game.add.text(120, 250 + titlePlusY, "Press SPACE to start", {fontSize: '32px', fill: '#fff'});
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');

		creditsText = game.add.text(120 - titlePlusY, 350, "Press C for credits", {fontSize: '32px', fill: '#fff'});
		
	},
	update: function() {

		// main menu logic

		if (pressedSpace) {
			titlePlusY = approach(titlePlusY, 600, 24);
			if (titlePlusY >= 450) {
				game.state.start("Play");
			}
		}
		else {
			titlePlusY = approach(titlePlusY, 0, 12);
			if (titlePlusY < 20) {
				if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
					pressedSpace = true;
				}
			}
		}

		titleSprite.y = 60 + titlePlusY;
		subtitleText.y = 250 + titlePlusY;
		creditsText.x = 120 - titlePlusY;
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

		// add sounds to game
		hitSound = game.add.audio("hitSound");
		scootLeftSound = game.add.audio("scootLeftSound");
		scootRightSound = game.add.audio("scootRightSound");
		jumpSound = game.add.audio("jumpSound");
		pointSound = game.add.audio("pointSound");
		music = game.add.audio("music");
		game.add.audio("motorcycleSound");

		// play music and motorcycle sound
		music.play();
		motorcycleSound = new Phaser.Sound(game, "motorcycleSound", 0.75, true);
		motorcycleSound.play();

		// initialize some variables
		game.score = 0;
		game.lives = 3;
		livesGroup = game.add.group();
		playerPos = 0;
		yOffset = 0;
		playerXStart = 180;
		playerYStart = game.world.height - 150;
		maxSpawn = 3;
		palmSide = 1;

		// add player
		player = game.add.sprite(playerXStart, playerYStart, 'guy');
		playerGroup = game.add.group();
		playerGroup.add(player);

		frontDecorGroup = game.add.group();

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
		changeSpawnRate();

		// makes it so player is always on top layer
		game.world.bringToTop(playerGroup);
		game.world.bringToTop(frontDecorGroup);
		

		// keyboard input
		if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && playerPos > 0
		&& player.body.y >= playerYStart - 2) {
			playerPos--;
			scootLeftSound.play();
		}
		else if (game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && playerPos < 2
		&& player.body.y >= playerYStart - 2) {
			playerPos++;
			scootRightSound.play();
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
			jumpSound.play();
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
		/*
		var gameoverText1 = game.add.text(16, 100, "GAME OVER!", {fontSize: '32px', file: '#000'});
		var gameoverText2 = game.add.text(16, 150, "Your final score: " + game.score, {fontSize: '32px', file: '#000'});
		var gameoverText3 = game.add.text(16, 200, 'Press SPACE to restart!', {fontSize: '32px', file: '#000'});
		gameoverText1.addColor("#ff0000", 0); //red
		gameoverText2.addColor("#ff0000", 0); //red
		gameoverText3.addColor("#ff0000", 0); //red
		*/

		music.stop();
		motorcycleSound.stop();

		// gameover text and instructions
		gameoverPlusY = 600;
		pressedSpace = false;
		bgSprite = game.add.sprite(0, 0, 'sky');
		gameoverSprite = game.add.sprite(90, 60 + gameoverPlusY, 'gameover');
		subtitleText1 = game.add.text(120, 240 + gameoverPlusY, "Your final score: " + game.score, {fontSize: '32px', fill: '#fff'});
		subtitleText2 = game.add.text(120, 290 + gameoverPlusY, "Press SPACE to restart", {fontSize: '32px', fill: '#fff'});
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');
	},
	update: function() {

		if (pressedSpace) {
			gameoverPlusY = approach(gameoverPlusY, 600, 24);
			if (gameoverPlusY >= 450) {
				game.state.start("Play");
			}
		}
		else {
			gameoverPlusY = approach(gameoverPlusY, 0, 12);
			if (gameoverPlusY < 20) {
				if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
					pressedSpace = true;
				}
			}
		}

		gameoverSprite.y = 60 + gameoverPlusY;
		subtitleText1.y = 240 + gameoverPlusY;
		subtitleText2.y = 290 + gameoverPlusY;
	}
}

// add states to StateManager
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');




function clamp(value, min, max) {

	// clamp value between min and max
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
			this.enemy = new Avoid(game, 'cone', 'cone', 0.2, 0, currentLane, playerYStart + 80);	
			game.add.existing(this.enemy);
			laneList.push(currentLane);
		}
	}
	
	game.score++;

	// spawn decor
	//this.decor1 = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);

	if (palmSide < 0) {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);
		game.add.existing(this.decor);
	}
	else {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, 4, playerYStart + 80);
		frontDecorGroup.add(this.decor);
	}
	palmSide *= -1;

	
	//game.add.existing(this.decor2);

	// call this function again
	game.time.events.repeat(Phaser.Timer.SECOND * game.spawnRate, 1, spawnAvoids, this);
}

function collisionTest(pos) {

	// decrement lives if player hits an obstacle
	if (pos == playerPos && player.body.y >= playerYStart - 2) {
		game.lives--;
		yOffset = 30;
		hitSound.play();
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
	else if (game.score < 100) {
		game.spawnRate = 0.65;
	}
	else if (game.score < 120) {
		game.spawnRate = 0.5;
	}
}

function endGame() {
	game.state.start("GameOver");
}