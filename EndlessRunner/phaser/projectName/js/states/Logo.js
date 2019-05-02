// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');

		// time until MainMenu state begins
		logoScreenTimer = 120;

		// add logo and whiteout sprite
		game.add.sprite(0, 0, "logo");
		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
		whiteoutSprite.alpha = 0;

		// the game session has just begun, so the player will receive instructions
		game.help = 0;
		game.helpMax = 3;
	},
	update: function() {

		// decrement logoScreenTimer
		logoScreenTimer--;

		// fade to white once logoScreenTimer hits 0
		if (logoScreenTimer <= 0) {
			if (whiteoutSprite.alpha < 1) {
				whiteoutSprite.alpha += 0.05;
			}
			else {
				whiteoutSprite.alpha = 1;
				game.state.start("MainMenu");
			}
		}

		// skip logo if player presses SPACE
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			logoScreenTimer = 0;
		}

	}
}
