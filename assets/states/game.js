var nivel;
var conjuntoPatrones;
var pantalla;
var capa;

var game =  {
  preload:function(){
    // Se cargan el fondo y el laberinto a resolver
    //project.load.tilemap('level1', 'assets/gameAssets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('fondo', 'assets/img/project/sky.jpg');
    project.load.tilemap('textura', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('Dungeon', 'assets/map/Dungeon.png');

  },

  create: function(){
    project.stage.backgroundColor = '#454645';
    pantalla = project.add.tileSprite(0, 0, 320, 480, 'fondo');
    nivel = project.add.tilemap('textura');
	// El archivo anterior depende de la imagen que solicita tiles, puede verificarse en los assets.
    nivel.addTilesetImage('Dungeon');
    // Dentro del json, este es el nombre de ...
    capa = nivel.createLayer('Ground');
    capa.resizeWorld();
    //  By default Phaser only starts 2 pointers (enough for 2 fingers at once)

    //  addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

    //  Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

    project.input.addPointer();

  },

  render: function(){
    project.debug.pointer(project.input.mousePointer);
    project.debug.pointer(project.input.pointer1);

  }
}
