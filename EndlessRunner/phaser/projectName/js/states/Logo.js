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
		game.load.image('heartOutline', 'assets/img/heartOutline.png');
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.image('palm', 'assets/img/palm.png');
		game.load.image('title', 'assets/img/title.png');
		game.load.image('gameover', 'assets/img/gameover.png');
		game.load.image('barFill', 'assets/img/barFill.png');
		game.load.image('barOutline', 'assets/img/barOutline.png');
		game.load.image('barOutline2', 'assets/img/barOutline2.png');
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

		// load in texture atlases for roadpaint and player
		game.load.atlas('guy', 'assets/img/textureatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.atlas('roadpaint', 'assets/img/roadpaint_anim.png', 'assets/img/roadpaint_anim.json');
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
