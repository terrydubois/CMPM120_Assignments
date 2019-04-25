var game = new Phaser.Game(1152, 648, Phaser.AUTO);


// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');

	
		// load game sprites
		game.load.image('sky', 'assets/img/sky.png');
		game.load.image('grass', 'assets/img/grass.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.image('dog', 'assets/img/dog.png');
		game.load.image('guy', 'assets/img/guy.png');
		game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
		game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
		
		// load pop sound
		game.load.audio('popsound', 'assets/audio/pop.mp3');
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
		this.score = 0;
	},
	preload: function() {
		console.log('Play: preload');
	},
	create: function() {
		console.log('Play: create');

		// add background & foreground assets
		game.add.sprite(0, 0, 'sky');
		game.add.sprite(0, game.world.height / 2, 'grass');

		// initialize score to 0
		score = 0;

	},
	update: function() {
		
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
		var gameoverText2 = game.add.text(16, 150, "Your final score: " + score, {fontSize: '32px', file: '#000'});
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