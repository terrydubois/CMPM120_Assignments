// define gameover state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		console.log('GameOver: preload');
	},
	create: function() {
		console.log('GameOver: create');


		// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
		var newHS = false;
		if (localStorage.getItem('highscore') == null) {
			
			// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
			game.highscore = game.score;
			localStorage.setItem('highscore', game.highscore.toString());
			newHS = true;
		}
		else {

			// in this case, we have a saved browser highscore, so we compare it to this score
			let storedScore = parseInt(localStorage.getItem('highscore'));

			if (game.score > storedScore) {
				// player beat the highscore, so we overwrite the browser's highscore
				game.highscore = game.score;
				localStorage.setItem('highscore', game.highscore.toString());
				newHS = true;
			}
			else {
				// player didn't beat highscore, so the highscore remains the browser's highscore
				game.highscore = parseInt(localStorage.getItem('highscore'));
				newHS = false;
			}
		}

		// stop sounds
		music.stop();
		motorcycleSound.stop();

		// add gameover text
		gameoverPlusY = 600;
		pressedSpace = false;
		bgSprite = game.add.sprite(0, 0, 'sky');
		gameoverSprite = game.add.sprite(90, 60 + gameoverPlusY, 'gameover');
		subtitleText1 = game.add.text(120, 240 + gameoverPlusY, "Your final score: " + game.score, {fontSize: '32px', fill: '#fff'});
		subtitleText2 = game.add.text(120, 280 + gameoverPlusY, "Press SPACE to restart", {fontSize: '32px', fill: '#fff'});
		groundSprite = game.add.sprite(0, game.world.height / 2, 'ground');

		// tell player if they beat the highscore or not
		var hsText = "Your highscore: " + game.highscore;
		if (newHS) {
			hsText = "NEW HIGHSCORE!";
		}
		highscoreText = game.add.text(120 - gameoverPlusY, 360, hsText, {fontSize: '20px', fill: '#fff'});

		// roadpaint animation
		roadPaint = game.add.sprite(0, game.world.height / 2, "roadpaint");
		roadPaint.animations.add("roadpaint_anim", Phaser.Animation.generateFrameNames("Comp 2_", 0, 29, "", 5), 60, true);
		roadPaint.animations.play("roadpaint_anim");
		roadPaint.alpha = 0.5;

		// fade in from white
		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
	},
	update: function() {

		// return to mainmenu if player presses ESC
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.state.start("MainMenu");
		}

		// hide gameover text if we are returning to play state
		if (pressedSpace) {
			gameoverPlusY = approach(gameoverPlusY, 600, 24);
			if (gameoverPlusY >= 450) {
				game.state.start("Play");
			}
		}
		else {
			// show gameover text until player presses SPACE
			gameoverPlusY = approach(gameoverPlusY, 0, 12);
			if (gameoverPlusY < 20) {
				if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
					pressedSpace = true;
				}
			}
		}

		// update the Y position of all the gameover text
		gameoverSprite.y = 60 + gameoverPlusY;
		subtitleText1.y = 240 + gameoverPlusY;
		subtitleText2.y = 280 + gameoverPlusY;
		highscoreText.x = 120 - gameoverPlusY;

		// make the whiteout fade away at the beginning of this state
		if (whiteoutSprite.alpha > 0) {
			whiteoutSprite.alpha -= 0.04;
		}
		else {
			whiteoutSprite.alpha = 0;
		}
	}
}