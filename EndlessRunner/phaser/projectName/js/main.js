/*
	CMPM 120 - Spring 2019
	Terrence DuBois

	Endless Runner: VIBE 206

	Technical achievement:
		I am happy with how smooth all of the movements and transitions in this project turned out.
		I tried my hardest to add motion to all of the UI elements of the game, which often took
		a bit of extra coding time. Making the oncoming objects move in properly was difficult, because
		I had to play with their acceleration to mimic perspective.
	Artistic achievement:
		I was able to stick with my original goal of having a pseudo-3D visual style to the game.
		I am really happy with the color scheme and custom vector art, both of which took me a while
		to create in Illustrator. 

*/

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
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('LogoScreen', LogoScreen);
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);

// start on Logo
game.state.start('Boot');



// clamp value between min and max
function clamp(value, min, max) {
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}


// smoothly have one value approach another value
function approach(value, valueDest, rate) {
	if (value < valueDest) {
		value += Math.abs(value - valueDest) / rate;
	}
	else if (value > valueDest) {
		value -= Math.abs(value - valueDest) / rate;
	}

	return value;
}


// spawn cones
function spawnAvoids() {

	// only spawn cones if player has seen cone instructions
	if (game.help > game.helpMax - 2) {
		var laneList = [];

		for (var i = 0; i < maxSpawn; i++) {

			// get lane that this cone will spawn into
			var currentLane = Math.floor(Math.random() * 3);

			// always spawn a cone in the player's lane
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

		// keep track of how many triple cones we spawn, so we don't spawn multiple triples in a row
		if (laneList.length < 3) {
			spawnsSinceTriple++;
		}
		else {
			spawnsSinceTriple = 0;
		}

		// increment score every spawn
		game.score++;
	}


	// alternate between spawning a palm tree on the left, right, and spawning a diamond
	if (palmSide == 1) {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, -1, playerYStart + 80);
		game.add.existing(this.decor);
	}
	else if (palmSide == 2) {
		// only spawn diamonds once player has read diamond instructions
		if (game.help > game.helpMax - 1) {
			game.time.events.repeat(Phaser.Timer.SECOND * (game.spawnRate / 2), 1, spawnPoint, this);
		}
	}
	else {
		this.decor = new Decor(game, 'palm', 'palm', 0, 0, 4, playerYStart + 80);
		frontDecorGroup.add(this.decor);
	}

	// increment palmSide, keep its value either 0, 1, or 2
	palmSide++;
	if (palmSide > 2) {
		palmSide = 0;
	}

	// call this function again
	game.time.events.repeat(Phaser.Timer.SECOND * game.spawnRate, 1, spawnAvoids, this);
}


// spawn a diamond
function spawnPoint() {

	// get the lane to spawn in, make sure it is not the player's current lane
	currentLane = playerPos + 1;
	if (currentLane > 2) {
		currentLane = 0;
	}

	// add diamond to game (Avoid but with "bad" variable set to false)
	this.point = new Avoid(game, 'diamond', 'diamond', 0.2, 0, currentLane, playerYStart + 40, false);	
	game.add.existing(this.point);
}


// test if cone or diamond has collided with player
function collisionTest(obj, pos, bad) {

	if (pos == playerPos && player.body.y >= playerYStart - 2) {

		// if we are hitting a cone (bad) or a diamond (not bad)
		if (bad) {
			// if player hits a cone: lives decrement, shake screen, play hit sound
			game.lives--;
			yOffset = 30;
			hitSound.play();

			player.body.velocity.y = -100;

			// end game if out of lives
			if (game.lives <= 0) {
				game.lives = 0;
				playerEndGame = true;
			}
		}
		else {

			// if player hits a diamond: score increases by 5, play point sound, destroy diamond object
			game.score += 5;
			pointSound.play();
			obj.kill();
		}
	}
}


// decrease time between spawns as player's score go up
function changeSpawnRate() {
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


// display instructions at beginning of play
function handleHelp() {

	var helpDest = 0;
	game.helpWait--;

	// get string for current help message
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

	// skip instructions if player presses Z
	if (game.input.keyboard.justPressed(Phaser.Keyboard.Z)) {
		game.help = game.helpMax;
	}

	// the left, center, and right positions of help text
	var leftPos = (game.world.width / 2) - 600;
	var centerPos = (game.world.width / 2) - 300;
	var rightPos = (game.world.width / 2);

	
	if (game.helpWait >= 360) {
		// help messages will begin on right with alpha of 0
		helpDest = rightPos;

		game.helpText.alpha = 0;
	}
	else if (game.helpWait >= 180) {
		// then help messages will glide to center and their alpha will increase
		helpDest = centerPos;

		if (game.helpText.alpha < 1) {
			game.helpText.alpha += 0.02;
		}
	}
	else {
		// then help messages will glide left and fade out
		helpDest = leftPos;

		if (game.helpText.alpha > 0) {
			game.helpText.alpha -= 0.02;
		}

		// once current help message is gone, start the next one
		if (game.helpX < leftPos + 20) {
			game.helpX = rightPos;
			game.helpText.x = game.helpX;
			game.help++;
			game.helpWait = 360;
		}
	}

	// glide current help message to its proper destination
	game.helpX = approach(game.helpX, helpDest, 36);

	// if we are passed messages, help text should be invisible
	if (game.help > game.helpMax) {
		game.helpText.alpha = 0;
	}
	
	// keep alpha between 0 and 1
	game.helpText.alpha = clamp(game.helpText.alpha, 0, 1);

	// update x & y for helpText
	game.helpText.x = game.helpX;
	game.helpText.y = game.helpY;
}