// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	
	},
	create: function() {
		console.log('MainMenu: create');

		playerEndGame = false;

		// add main menu text and backgrounds
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

		// add credits text(s)
		creditsText1 = game.add.text(120 - titlePlusY, 350, "Gameplay, programming, and visuals by Terry DuBois", {fontSize: '16px', fill: '#fff'});
		creditsText6 = game.add.text(120 - titlePlusY, 370, "terrydubois.io", {fontSize: '12px', fontStyle: 'italic', fill: '#fff'});
		creditsText2 = game.add.text(120 - titlePlusY, 400, "Music by Lakey Inspired", {fontSize: '16px', fill: '#fff'});
		creditsText3 = game.add.text(120 - titlePlusY, 420, "soundcloud.com/lakeyinspired", {fontSize: '12px', fontStyle: 'italic', fill: '#fff'});
		creditsText4 = game.add.text(120 - titlePlusY, 460, "Motorcycle sound by roman_cgr", {fontSize: '16px', fill: '#fff'});
		creditsText5 = game.add.text(120 - titlePlusY, 480, "freesound.org/people/roman_cgr", {fontSize: '12px', fontStyle: 'italic', fill: '#fff'});

		// set highscore to 0 (will be changed by browser in GameOver state)
		game.highscore = 0;

		// fade in from white
		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
	},
	update: function() {

		// fade white screen away
		if (whiteoutSprite.alpha > 0) {
			whiteoutSprite.alpha -= 0.04;
		}
		else {
			whiteoutSprite.alpha = 0;
		}

		// if player presses SPACE, hide the title and credits
		if (pressedSpace) {
			titlePlusY = approach(titlePlusY, 600, 20);
			if (titlePlusY >= 550) {
				game.state.start("Play");
			}
		}
		else {
			// if player has not pressed SPACE, show title and credits
			titlePlusY = approach(titlePlusY, 0, 12);
			if (titlePlusY < 20) {
				if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
					pressedSpace = true;
				}
			}
		}

		// update x & y of MainMenu text objects
		titleSprite.y = 60 + titlePlusY;
		subtitleText.y = 250 + titlePlusY;
		creditsText1.x = 120 - titlePlusY;
		creditsText2.x = creditsText1.x;
		creditsText3.x = creditsText1.x;
		creditsText4.x = creditsText1.x;
		creditsText5.x = creditsText1.x;
		creditsText6.x = creditsText1.x;
	}
}