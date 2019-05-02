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
		barOutline2 = game.add.sprite(16, 150, "barOutline2");
		barOutline2.alpha = 0;

		// draw score text
		scoreText1 = game.add.text(16, 16, 'SCORE:', {fontStyle: 'italic', fontSize: '20px', fill: '#facade', align: 'left'});
		scoreText2 = game.add.text(60, 16, '0', {fontStyle: 'italic', fontSize: '60px', fill: '#facade', align: 'left'});
		jumpText = game.add.text(16, 180, "JUMP", {fontSize: '25px', fontStyle: 'italic', fill: '#fff'});
		scoreTextPlusX = 400;

		// initialize help text
		game.helpX = (game.world.width / 2) + 100;
		game.helpY = (game.world.height / 2) - 60;
		game.helpWait = 460;
		game.helpText = game.add.text(16, 180, "Use LEFT and RIGHT to move", {fontSize: '30px', align: 'center', fontStyle: 'italic', fill: '#fff'});
		game.helpText.alpha = 0;

		// draw hearts and heart outlines initially
		heartSprite = [];
		heartOutlineSprite = [];
		for (var i = 0; i < game.lives; i++) {
			heartSprite[i] = game.add.sprite(24 + (i * 64), 80, "heart");
			heartOutlineSprite[i] = game.add.sprite(24 + (i * 64), 80, "heartOutline");
		}

		// add sounds to game
		hitSound = game.add.audio("hitSound");
		scootLeftSound = game.add.audio("scootLeftSound");
		scootRightSound = game.add.audio("scootRightSound");
		jumpSound = game.add.audio("jumpSound");
		pointSound = game.add.audio("pointSound");
		music = game.add.audio("music");
		music.loop = true;
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

		// add player to playerGroup for layering purposes
		player = game.add.sprite(playerXStart - playerPlusX, playerYStart + playerPlusY, 'guy');
		playerGroup = game.add.group();
		playerGroup.add(player);

		// make group for front palm trees for layering purposes
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

		// show instructions
		handleHelp(help, helpWait);

		// set jump-bar width to proper value
		barFill.width = jumpPower * barOutline.width;
		jumpPower += 0.002;
		jumpPower = Math.min(jumpPower, 1);

		// quit to MainMenu if player presses SPACE
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			music.stop();
			motorcycleSound.stop();
			game.state.start("MainMenu");
		}

		// hide HUD stuff if the game has ended
		if (playerEndGame) {
			scoreTextPlusX = approach(scoreTextPlusX, 400, 12);
		}
		else {
			// show HUD stuff if player is playing
			if (scoreTextPlusX >= 1) {
				scoreTextPlusX = approach(scoreTextPlusX, 0, 12);
			}
		}
		// update X position of HUD stuff
		scoreText1.x = 24 - scoreTextPlusX;
		scoreText2.x = 120 - scoreTextPlusX;
		jumpText.x = 80 - scoreTextPlusX;
		barOutline.x = 16 - scoreTextPlusX;
		barOutline2.x = barOutline.x;
		barFill.x = barOutline.x + 2;

		// custom camera shake (so that I can shake only the Y, not the X)
		yOffset = approach(yOffset, 0, 12);
		var relativeYOffset = Math.random() * yOffset;
		if (yOffset > 3) {
			if (Math.random() > 0.5) {
				relativeYOffset *= -1;
			}
			// update Y position of HUD stuff with screen shake
			groundSprite.body.y = (game.world.height / 2) + relativeYOffset;
			bgSprite.body.y = relativeYOffset;
			scoreText1.y = 115 + relativeYOffset;
			scoreText2.y = 83 + relativeYOffset;
			jumpText.y = 165 + relativeYOffset;
			barOutline.y = 150 + relativeYOffset;
		}
		else {
			// update Y position of HUD stuff without screen shake
			groundSprite.body.y = (game.world.height / 2);
			bgSprite.body.y = 0;
			scoreText1.y = 115;
			scoreText2.y = 83;
			jumpText.y = 165;
			barOutline.y = 150;
		}
		barFill.y = barOutline.y;
		barOutline2.y = barOutline.y

		// update heart sprites, also update their X & Y
		for (var i = 0; i < 3; i++) {

			heartOutlineSprite[i].x = 24 + (i * 58) - scoreTextPlusX;
			if (yOffset > 3) {
				heartOutlineSprite[i].y = 30 + relativeYOffset;
			}
			else {
				heartOutlineSprite[i].y = 30;
			}

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

		// set text for score text
		scoreText1.text = "SCORE: ";
		scoreText2.text = game.score;

		// update spawn rate so game gets harder as it progressess
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

			// if it's been less than 4 cone spawns since a triple spawn, make it so there is a max of 2 cones per spawn
			if (spawnsSinceTriple < 4) {
				maxSpawn = 2;
			}
		}

		// if the game is over, make player fall back
		if (playerEndGame) {
			playerPlusX = approach(playerPlusX, 500, 12);
			if (player.body.y >= game.world.height + 200) {
				game.state.start("GameOver");
			}
		}
		else {
			// if game is not over, playerPlusX should be 0
			if (playerPlusX > 0) {
				playerPlusX = approach(playerPlusX, 0, 12);
				playerPlusY = playerPlusX;
			}
		}

		// blink jump-bar outline if the bar is full
		if (jumpPower >= 1) {
			if (barOutline2.alpha < 1) {
				barOutline2.alpha += 0.03;
			}
			else {
				barOutline2.alpha = 0;
			}
		}
		else {
			barOutline2.alpha = 0;
		}
	}
}
