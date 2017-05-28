var nivel;
var conjuntoPatrones;
var pantalla;
var capa;
var jugador;

var game =  {
  preload:function(){
    // Se cargan el fondo y el laberinto a resolver
    //project.load.tilemap('level1', 'assets/gameAssets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('fondo', 'assets/img/project/sky.jpg');
    project.load.tilemap('textura', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('Dungeon', 'assets/map/Dungeon.png');
    project.load.image('monkey', 'assets/img/project/Mankey.png')

  },

  create: function(){
    project.physics.startSystem(Phaser.Physics.ARCADE);
    project.stage.backgroundColor = '#454645';
    pantalla = project.add.tileSprite(0, 0, 320, 480, 'fondo');
    pantalla.fixedToCamera = true;
    nivel = project.add.tilemap('textura');
	// El archivo anterior depende de la imagen que solicita tiles, puede verificarse en los assets.
    nivel.addTilesetImage('Dungeon');
    // Dentro del json, este es el nombre de ...

    nivel.setCollisionByExclusion([ 1139, 1138, 1101, 1103, 1111, 1135, 1203 ]);
    capa = nivel.createLayer('Ground');
    capa.resizeWorld();
    // Y se le da gravedad gracias a la libreria ARCADE de Phaser
    project.physics.arcade.gravity.y = 100;
	// Se carga el perro y su ubicación en el laberinto
    jugador = project.add.sprite(32, 32, 'monkey');

    //  By default Phaser only starts 2 pointers (enough for 2 fingers at once)
     project.physics.enable(jugador, Phaser.Physics.ARCADE);
     jugador.body.collideWorldBounds = true;
     jugador.body.setSize(32, 32, 0, 0);

     project.camera.follow(jugador);
    //  addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

    //  Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

    project.input.addPointer();

  },

  update: function(){
    Phaser.physics.arcade.collide(jugador, capa);
     jugador.body.velocity.x = 0;
  },

  render: function(){
    project.debug.pointer(project.input.mousePointer);
    project.debug.pointer(project.input.pointer1);

  }
}
