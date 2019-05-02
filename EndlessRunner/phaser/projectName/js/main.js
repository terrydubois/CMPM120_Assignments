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
var help;
var helpWait;



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

	if (game.help > game.helpMax) {
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
	}

	// spawn decor
	//this.decor1 = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);

	if (palmSide == 1) {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);
		game.add.existing(this.decor);
	}
	else if (palmSide == 2) {
		if (game.help > game.helpMax) {
			game.time.events.repeat(Phaser.Timer.SECOND * (game.spawnRate / 2), 1, spawnPoint, this);
		}
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

	this.point = new Avoid(game, 'diamond', 'diamond', 0.2, 0, currentLane, playerYStart + 40, false);	
	game.add.existing(this.point);
}

function collisionTest(obj, pos, bad) {

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

			obj.kill();
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

function handleHelp() {

	var helpDest = 0;
	game.helpWait--;

	if (game.help == 0) {
		game.helpText.text = "Use LEFT and RIGHT to move";
	}
	else if (game.help == 1) {
		game.helpText.text = "Use UP to jump when the bar is full";
	}
	else if (game.help == 2) {
		game.helpText.text = "Avoid the cones";
	}
	else if (game.help == 3) {
		game.helpText.text = "Collect diamonds for extra points";
	}

	if (game.input.keyboard.justPressed(Phaser.Keyboard.Z)) {
		game.help = game.helpMax;
	}


	var leftPos = (game.world.width / 2) - 600;
	var centerPos = (game.world.width / 2) - 300;
	var rightPos = (game.world.width / 2);


	if (game.helpWait >= 360) {
		helpDest = rightPos;

		game.helpText.alpha = 0;
	}
	else if (game.helpWait >= 180) {
		helpDest = centerPos;

		if (game.helpText.alpha < 1) {
			game.helpText.alpha += 0.02;
		}
	}
	else {
		helpDest = leftPos;

		if (game.helpText.alpha > 0) {
			game.helpText.alpha -= 0.02;
		}

		if (game.helpX < leftPos + 20) {
			game.helpX = rightPos;
			game.helpText.x = game.helpX;
			game.help++;
			game.helpWait = 360;
		}
	}

	game.helpX = approach(game.helpX, helpDest, 36);

	if (game.help > game.helpMax) {
		game.helpText.alpha = 0;
	}
	
	game.helpText.alpha = clamp(game.helpText.alpha, 0, 1);

	game.helpText.x = game.helpX;
	game.helpText.y = game.helpY;
}