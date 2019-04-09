var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms;

function create() {
	game.add.sprite(0, 0, 'star');

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, 'sky');

	platforms.game.add.group();
	platforms = game.add.group();
	platforms.enableBody = true;
}

function update() {
}

