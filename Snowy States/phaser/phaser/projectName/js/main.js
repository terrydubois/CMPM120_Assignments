var game = new Phaser.Game(600, 800, Phaser.AUTO);



// initialize variables and some objects
var player;
var platforms;
var diamonds;
var score;
var scoreText;
var enemy1;
var enemy2;

// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');

	
		// load game sprites
		game.load.image('sky', 'assets/img/sky.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
		game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
	},
	create: function() {
		console.log('MainMenu: create');

		var titleText = game.add.text(16, 100, "TERRY'S AMAZING GAME", {fontSize: '32px', file: '#000'});
		var subtitleText = game.add.text(16, 150, "Press SPACE to start!", {fontSize: '32px', file: '#000'});
		titleText.addColor("#ff0000", 0); //red
		subtitleText.addColor("#ff0000", 0); //red
	},
	update: function() {
		// main menu logic
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay');
		}
	}
}

// define gameplay state and methods
var GamePlay = function(game) {};
GamePlay.prototype = {
	preload: function() {
		console.log('GamePlay: preload');
	},
	create: function() {
		console.log('GamePlay: create');

		// add sky background
		game.add.sprite(0, 0, 'sky');

		// add physics to Phaser
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// initialize score to 0
		score = 0;
		scoreText = 'Score: 0';

		// create group for platforms
		platforms = game.add.group();
		platforms.enableBody = true;

		// add ground platform to platform group
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		// add ledge platform to platform group
		var ledge = platforms.create(500, 450, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-350, 350, 'ground');
		ledge.body.immovable = true;
		// more ledges
		ledge = platforms.create(350, 600, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-200, 500, 'ground');
		ledge.body.immovable = true;



		// player physics setup
		player = game.add.sprite(32, game.world.height - 150, 'dude');
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

		// player animations
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);

		cursors = game.input.keyboard.createCursorKeys();

		// add star group
		stars = game.add.group();
		stars.enableBody = true;
		// create 12 stars distributed across x axis
		var starAmount = 12;
		for (var i = 0; i < starAmount; i++) {
			var star = stars.create(i * (game.world.width / starAmount), 0, 'star');
			star.body.gravity.y = 60;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		// create diamond group
		diamonds = game.add.group();
		diamonds.enableBody = true;

		// set position of diamond
		var diamondX  = clamp(Math.random() * game.world.width, 200, game.world.width - 200);
		var diamondY = clamp(Math.random() * (game.world.height / 2), 200, game.world.height / 2);
		diamonds.create(diamondX, diamondY, 'diamond');

		scoreText = game.add.text(16, 100, 'Score: 0', {fontSize: '32px', file: '#000'});


		// create enemies group
		enemies = game.add.group();
		enemies.enableBody = true;
		enemy1 = enemies.create(Math.random() * (game.world.width - 100), 100, 'baddie');
		enemy1.body.gravity.y = 60;
		game.physics.arcade.enable(enemy1);
		enemy2 = enemies.create(Math.random() * (game.world.width - 100), 100, 'baddie');
		enemy2.body.gravity.y = 60;
		game.physics.arcade.enable(enemy2);

		// enemy animations
		enemy1.animations.add('left', [0, 1], 10, true);
		enemy1.animations.play('left');
		enemy2.animations.add('right', [2, 3], 10, true);
		enemy2.animations.play('right');
	},
	update: function() {
		// gameplay logic
		// platform collisions
		var hitPlatform = game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(enemies, platforms);

		// get keyboard input and update player physics and animations
		player.body.velocity.x = 0;
		if (cursors.left.isDown) {
			player.body.velocity.x = -150;
			player.animations.play('left');
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = 150;
			player.animations.play('right');
		}
		else {
			player.animations.stop();
			player.frame = 4;
		}

		// player jump
		if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
			player.body.velocity.y = -350;
		}

		// star collision with ground platform
		game.physics.arcade.collide(stars, platforms);
		// star collision with player
		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		// diamond collision with player
		game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
		// enemy collision with player
		game.physics.arcade.overlap(player, enemies, hitEnemy, null, this);
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

		var gameoverText1 = game.add.text(16, 100, "GAME OVER!", {fontSize: '32px', file: '#000'});
		var gameoverText2 = game.add.text(16, 150, "Your final score: " + score, {fontSize: '32px', file: '#000'});
		var gameoverText3 = game.add.text(16, 200, 'Press SPACE to restart!', {fontSize: '32px', file: '#000'});
		gameoverText1.addColor("#ff0000", 0); //red
		gameoverText2.addColor("#ff0000", 0); //red
		gameoverText3.addColor("#ff0000", 0); //red
	},
	update: function() {
		// gameover logic
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('MainMenu');
		}
	}
}

// add states to StateManager
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');

function collectStar(player, star) {
	// remove star from screen
	star.kill();

	// increment score
	score += 10;
	scoreText.text = 'Score: ' + score;
}

function collectDiamond(player, diamond) {
	// remove diamond from screen
	diamond.kill();

	// increment score
	score += 50;
	scoreText.text = 'Score: ' + score;
}

function hitEnemy(player, enemy) {
	// remove enemy from screen
	enemy.kill();

	// decrement score
	score -= 25;
	scoreText.text = 'Score: ' + score;

	game.state.start('GameOver');
}

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