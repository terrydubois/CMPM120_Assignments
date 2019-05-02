// define gameover state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		console.log('GameOver: preload');
	},
	create: function() {
		console.log('GameOver: create');


		var newHS = false;

		if (localStorage.getItem('highscore') == null) {
			console.log("no highscore yet");
			game.highscore = game.score;
			localStorage.setItem('highscore', game.highscore.toString());
			newHS = true;
		}
		else {
			let storedScore = parseInt(localStorage.getItem('highscore'));

			if (game.score > storedScore) {
				console.log('new hs');
				game.highscore = game.score;
				localStorage.setItem('highscore', game.highscore.toString());
				newHS = true;
			}
			else {
				console.log('no new hs');
				game.highscore = parseInt(localStorage.getItem('highscore'));
				newHS = false;
			}
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

		whiteoutSprite = game.add.sprite(0, 0, "whiteout");
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



		if (whiteoutSprite.alpha > 0) {
			whiteoutSprite.alpha -= 0.04;
		}
		else {
			whiteoutSprite.alpha = 0;
		}
	}
}