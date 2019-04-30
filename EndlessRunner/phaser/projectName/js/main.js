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
var heartSprite;
var yOffset;
var titlePlusY;
var playerEndGame;
var highscore;


// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');
	
		// load game sprites
		game.load.image('sky', 'assets/img/skysun.png');
		game.load.image('ground', 'assets/img/groundnew_nolines.png');
		game.load.image('cone', 'assets/img/cone.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.image('palm', 'assets/img/palm.png');
		game.load.image('title', 'assets/img/title.png');
		game.load.image('gameover', 'assets/img/gameover.png');
		game.load.image('barFill', 'assets/img/barFill.png');
		game.load.image('barOutline', 'assets/img/barOutline.png');
		game.load.image('logo', 'assets/img/logo.png');
		game.load.image('whiteout', 'assets/img/whiteout.png');
		
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
		game.load.atlas('roadpaint', 'assets/img/roadpaint_anim.png', 'assets/img/roadpaint_anim.json');
	},
	create: function() {
		console.log('LogoScreen: create');

		logoScreenTimer = 120;

		game.add.sprite(0, 0, "logo");
		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
		whiteoutSprite.alpha = 0;
	},
	update: function() {

		logoScreenTimer--;
		if (logoScreenTimer <= 0) {
			if (whiteoutSprite.alpha < 1) {
				whiteoutSprite.alpha += 0.05;
			}
			else {
				whiteoutSprite.alpha = 1;
				game.state.start("MainMenu");
			}
		}

	}
}






// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	
	},
	create: function() {
		console.log('MainMenu: create');

		playerEndGame = false;

		// main menu text and instructions
		titlePlusY = 600;
		pressedSpace = false;
		bgSprite = game.add.sprite(0, 0, 'sky');
		titleSprite = game.add.sprite(90, 60 + titlePlusY, 'title');
		subtitleText = game.add.text(120, 250 + titlePlusY, "Press SPACE to start", {fontSize: '32px', fill: '#fff'});
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');

		// roadpaint animation
		roadPaint = game.add.sprite(0, game.world.height / 2, "roadpaint");
		roadPaint.animations.add("roadpaint_anim", Phaser.Animation.generateFrameNames("Comp 2_", 0, 29, "", 5), 60, true);
		roadPaint.animations.play("roadpaint_anim");
		roadPaint.alpha = 0.5;


		creditsText1 = game.add.text(120 - titlePlusY, 350, "Gameplay, programming, and visuals by Terry DuBois", {fontSize: '16px', fill: '#fff'});
		creditsText2 = game.add.text(120 - titlePlusY, 390, "Music by Lakey Inspired", {fontSize: '16px', fill: '#fff'});
		creditsText3 = game.add.text(120 - titlePlusY, 410, "soundcloud.com/lakeyinspired", {fontSize: '12px', fontStyle: 'italic', fill: '#fff'});
		creditsText4 = game.add.text(120 - titlePlusY, 440, "Motorcycle sound by roman_cgr", {fontSize: '16px', fill: '#fff'});
		creditsText5 = game.add.text(120 - titlePlusY, 460, "freesound.org/people/roman_cgr", {fontSize: '12px', fontStyle: 'italic', fill: '#fff'});
		

		game.highscore = 0;

		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
	},
	update: function() {

		if (whiteoutSprite.alpha > 0) {
			whiteoutSprite.alpha -= 0.04;
		}
		else {
			whiteoutSprite.alpha = 0;
		}

		// main menu logic
		if (pressedSpace) {
			titlePlusY = approach(titlePlusY, 600, 20);
			if (titlePlusY >= 550) {
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
		creditsText1.x = 120 - titlePlusY;
		creditsText2.x = creditsText1.x;
		creditsText3.x = creditsText1.x;
		creditsText4.x = creditsText1.x;
		creditsText5.x = creditsText1.x;
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

		// roadpaint animation
		roadPaint = game.add.sprite(0, game.world.height / 2, "roadpaint");
		roadPaint.animations.add("roadpaint_anim", Phaser.Animation.generateFrameNames("Comp 2_", 0, 29, "", 5), 60, true);
		roadPaint.animations.play("roadpaint_anim");
		roadPaint.alpha = 0.5;

		// jump-bar
		barFill = game.add.sprite(16, 150, "barFill");
		barOutline = game.add.sprite(16, 150, "barOutline");

		// draw score text
		scoreText1 = game.add.text(16, 16, 'SCORE:', {fontStyle: 'italic', fontSize: '20px', fill: '#facade', align: 'left'});
		scoreText2 = game.add.text(60, 16, '0', {fontStyle: 'italic', fontSize: '60px', fill: '#facade', align: 'left'});
		jumpText = game.add.text(16, 180, "JUMP", {fontSize: '25px', fontStyle: 'italic', fill: '#fff'});
		scoreTextPlusX = 400;

		// hearts for lives
		heartSprite = [];
		for (var i = 0; i < game.lives; i++) {
			heartSprite[i] = game.add.sprite(24 + (i * 64), 80, "heart");
		}

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
		playerPlusX = 300;
		playerPlusY = 300;
		maxSpawn = 3;
		palmSide = 0;
		playerEndGame = false;
		jumpPower = 0;
		spawnsSinceTriple = 0;

		// add player
		player = game.add.sprite(playerXStart - playerPlusX, playerYStart + playerPlusY, 'guy');
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

		barFill.width = jumpPower * barOutline.width;
		jumpPower += 0.002;
		jumpPower = Math.min(jumpPower, 1);

		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			music.stop();
			motorcycleSound.stop();
			game.state.start("MainMenu");
		}

		if (playerEndGame) {
			scoreTextPlusX = approach(scoreTextPlusX, 400, 12);
		}
		else {
			if (scoreTextPlusX >= 1) {
				scoreTextPlusX = approach(scoreTextPlusX, 0, 12);
			}
		}
		scoreText1.x = 24 - scoreTextPlusX;
		scoreText2.x = 120 - scoreTextPlusX;
		jumpText.x = 80 - scoreTextPlusX;
		barOutline.x = 16 - scoreTextPlusX;
		barFill.x = barOutline.x + 2;

		// custom camera shake (so that I can shake only the Y, not the X)
		yOffset = approach(yOffset, 0, 12);
		var relativeYOffset = Math.random() * yOffset;
		if (yOffset > 3) {
			if (Math.random() > 0.5) {
				relativeYOffset *= -1;
			}
			groundSprite.body.y = (game.world.height / 2) + relativeYOffset;
			bgSprite.body.y = relativeYOffset;
			scoreText1.y = 115 + relativeYOffset;
			scoreText2.y = 83 + relativeYOffset;
			jumpText.y = 165 + relativeYOffset;
			barOutline.y = 150 + relativeYOffset;
		}
		else {
			groundSprite.body.y = (game.world.height / 2);
			bgSprite.body.y = 0;
			scoreText1.y = 115;
			scoreText2.y = 83;
			jumpText.y = 165;
			barOutline.y = 150;
		}
		barFill.y = barOutline.y;

		for (var i = 0; i < 3; i++) {
			if (game.lives < i + 1) {
				heartSprite[i].kill();
			}
			else {
				heartSprite[i].x = 24 + (i * 58) - scoreTextPlusX;
				if (yOffset > 3) {
					heartSprite[i].y = 30 + relativeYOffset;
				}
				else {
					heartSprite[i].y = 30;
				}
			}
		}

		scoreText1.text = "SCORE: ";
		scoreText2.text = game.score;
		changeSpawnRate();

		// makes it so player is always on top layer
		game.world.bringToTop(playerGroup);
		game.world.bringToTop(frontDecorGroup);
		

		// keyboard input
		if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && playerPos > 0
		&& player.body.y >= playerYStart - 2 && !playerEndGame) {
			playerPos--;
			scootLeftSound.play();
		}
		else if (game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && playerPos < 2
		&& player.body.y >= playerYStart - 2 && !playerEndGame) {
			playerPos++;
			scootRightSound.play();
		}

		// update player's x position
		playerXDest = playerXStart + (playerPos * 160);
		player.body.x = approach(player.body.x, playerXDest - playerPlusX, 8);

		// update player's y position
		if (playerEndGame) {
			player.body.velocity.y = 400;
		}
		else {
			if (player.body.y >= playerYStart - 2) {
				player.body.gravity.y = 0;
				player.body.velocity.y = 0;
				player.body.y = playerYStart - 2 + relativeYOffset + (Math.random() * 3) + playerPlusY;
			}
			else {
				player.body.gravity.y = 1200;
			}

			// jumping
			if (jumpPower < 1) {
				maxSpawn = 2;
			}
			else {
				maxSpawn = 3;
				if ((game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
				|| game.input.keyboard.justPressed(Phaser.Keyboard.UP))
				&& (player.body.y >= playerYStart - 2)) {
					if (playerPlusY < 2) {
						player.body.velocity.y = -350;
						jumpSound.play();
						jumpPower = 0;
					}
				}
			}

			if (spawnsSinceTriple < 4) {
				maxSpawn = 2;
			}
		}

		if (playerEndGame) {
			playerPlusX = approach(playerPlusX, 500, 12);
			//playerPlusY = playerPlusX;
			if (player.body.y >= game.world.height + 200) {
				game.state.start("GameOver");
			}
		}
		else {
			if (playerPlusX > 0) {
				playerPlusX = approach(playerPlusX, 0, 12);
				playerPlusY = playerPlusX;
			}
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

		if (game.score > game.highscore) {
			game.highscore = game.score;
		}

		music.stop();
		motorcycleSound.stop();

		// gameover text and instructions
		gameoverPlusY = 600;
		pressedSpace = false;
		bgSprite = game.add.sprite(0, 0, 'sky');
		gameoverSprite = game.add.sprite(90, 60 + gameoverPlusY, 'gameover');
		subtitleText1 = game.add.text(120, 240 + gameoverPlusY, "Your final score: " + game.score, {fontSize: '32px', fill: '#fff'});
		subtitleText2 = game.add.text(120, 280 + gameoverPlusY, "Press SPACE to restart", {fontSize: '32px', fill: '#fff'});
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');
		highscoreText = game.add.text(120 - gameoverPlusY, 350, "Your highscore: " + game.highscore, {fontSize: '16px', fill: '#fff'});

		// roadpaint animation
		roadPaint = game.add.sprite(0, game.world.height / 2, "roadpaint");
		roadPaint.animations.add("roadpaint_anim", Phaser.Animation.generateFrameNames("Comp 2_", 0, 29, "", 5), 60, true);
		roadPaint.animations.play("roadpaint_anim");
		roadPaint.alpha = 0.5;
	},
	update: function() {

		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.state.start("MainMenu");
		}

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
		subtitleText2.y = 280 + gameoverPlusY;
		highscoreText.x = 120 - gameoverPlusY;
	}
}

// add states to StateManager
game.state.add('LogoScreen', LogoScreen);
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('LogoScreen');




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
		if (i == 0) {
			currentLane = playerPos;
		}
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
			this.enemy = new Avoid(game, 'cone', 'cone', 0.2, 0, currentLane, playerYStart + 80, true);	
			game.add.existing(this.enemy);
			laneList.push(currentLane);
		}
	}

	if (laneList.length < 3) {
		spawnsSinceTriple++;
	}
	else {
		spawnsSinceTriple = 0;
	}
	console.log("spawnsSinceTriple: " + spawnsSinceTriple);
	
	game.score++;

	// spawn decor
	//this.decor1 = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);

	if (palmSide == 1) {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);
		game.add.existing(this.decor);
	}
	else if (palmSide == 2) {
		game.time.events.repeat(Phaser.Timer.SECOND * (game.spawnRate / 2), 1, spawnPoint, this);
	}
	else {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, 4, playerYStart + 80);
		frontDecorGroup.add(this.decor);
	}

	palmSide++;
	if (palmSide > 2) {
		palmSide = 0;
	}


	// call this function again
	game.time.events.repeat(Phaser.Timer.SECOND * game.spawnRate, 1, spawnAvoids, this);
}

function spawnPoint() {
	currentLane = playerPos + 1;
	if (currentLane > 2) {
		currentLane = 0;
	}

	this.point = new Avoid(game, 'heart', 'heart', 0.2, 0, currentLane, playerYStart + 80, false);	
	game.add.existing(this.point);
}

function collisionTest(pos, bad) {

	if (pos == playerPos && player.body.y >= playerYStart - 2) {

		if (bad) {

			// decrement lives if player hits an obstacle
			game.lives--;
			yOffset = 30;
			hitSound.play();

			player.body.velocity.y = -100;
			

			if (game.lives <= 0) {
				game.lives = 0;
				playerEndGame = true;
			}
		}
		else {

			game.score += 5;
			pointSound.play();
		}
	}
}

function changeSpawnRate() {

	// decrease time between spawns as player scores go up
	if (game.score < 50) {
		game.spawnRate = 1.3;
	}
	else if (game.score < 100) {
		game.spawnRate = 1.15;
	}
	else if (game.score < 150) {
		game.spawnRate = 1;
	}
	else if (game.score < 200) {
		game.spawnRate = 0.9;
	}
	else if (game.score < 250) {
		game.spawnRate = 0.8;
	}
	else if (game.score < 300) {
		game.spawnRate = 0.7;
	}
	else if (game.score < 350) {
		game.spawnRate = 0.6;
	}
	else {
		game.spawnRate = 0.5;
	}
}