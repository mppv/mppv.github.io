/*

  PRESENTADO POR:
  Monica Patricia Pineda Vargass

  REFERENCIAS:
  Este trabajo se basa en los ejemplos Multi Touch y Starstruck de Phaser, 
  disponibles en https://phaser.io/examples

  Adicional a ello, para el soporte de Touch, fueron revisados diversos foros
  en el sitio: http://www.html5gamedevs.com/

*/

// Se declaran las variables que se usaran a lo largo de este script
var nivel;
var conjuntoPatrones;
var pantalla;
var capa;
var jugador;
var cursores;
var saltar;
var mira = 'left';
var tiempoSalto = 0;
var RIGHT = 0, LEFT = 1;

// Se declara el estado game, el cual contiene todo el jugable
var game =  {
  // Son precargadas los recursos del juego (sprite de jugador, fondo, 
  // el laberinto en formato json, y el conjunto de texturas)
  preload:function(){
    project.load.image('monkey', 'assets/img/project/Mankey.png');
    project.load.image('fondo', 'assets/img/project/sky.jpg');
    project.load.tilemap('textura', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('Dungeon', 'assets/map/Dungeon_map.png');
    
  },

  create: function(){
    // color por defecto del fondo
    project.stage.backgroundColor = '#454645';

    // Es cargado el fondo al Canvas, y se habiita la funcion camara
    pantalla = project.add.tileSprite(0, 0, 320, 480, 'fondo');
    pantalla.fixedToCamera = true;

    // Se crea un nivel con el mapa realizado en json con las texturas
    // El archivo json contiene los nombres descritos como parametros, 
    // lo que permite su facil acceso al momento de ejecucion    
    nivel = project.add.tilemap('textura');
    nivel.addTilesetImage('Dungeon');

    // La textura cargada contiene mas de 3000 patrones. El personaje
    // colisionara entre la 1 y la 2870, y los restantes seran parte
    // del ambiente
    nivel.setCollisionBetween(1, 2870);

    // y, se aniade como capa y se incorpora al tamanio del Canvas
    capa = nivel.createLayer('Ground');
    capa.resizeWorld();

    // Se habilita la funcion ARCADE de Phaser, el cual implementa colisiones
    // y la funcion de gravedad de los elementos en el mundo
    project.physics.startSystem(Phaser.Physics.ARCADE);
    project.physics.arcade.gravity.y = 100;

    // Se carga el elemento jugable y se 
    jugador = project.add.sprite(32, 32, 'monkey');
    jugador.name = 'monkey';
    project.physics.enable(jugador, Phaser.Physics.ARCADE);
    jugador.body.bounce.y = 0.2;
    jugador.body.collideWorldBounds = true;
    jugador.body.setSize(16, 32, 0, 0);

    //jugador.body.immovable = true;
    project.physics.arcade.enable([jugador, capa]);
    //efectoRebote
    //jugador.body.bounce.setTo(1, 1)

    project.camera.follow(jugador);
    //  addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

    //  Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

    //project.input.addPointer();

    project.input.keyboard.addCallbacks(this,this.onDown);
    cursores = project.input.keyboard.createCursorKeys();
    saltar = project.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    project.input.onDown.add(this.salto, this);


  },

  onTouch: function(){

    if (project.input.activePointer.isDown) {
      if (Math.floor(project.input.x / (project.width / 2)) === LEFT) {
          //alert("vamos, izquierda");
          //  Move to the left      
          jugador.body.velocity.x = 150;
          if (mira != 'left')
          {
                jugador.animations.play('left');
                mira = 'left';
          }
      }
      if (Math.floor(project.input.x / (project.width / 2)) === RIGHT) {
          //  Move to the right    
          jugador.body.velocity.x = -150;
          if (mira != 'right')
            {
                jugador.animations.play('right');
                mira = 'right';
            }
      }
      } else {
            if (mira != 'idle')
            {
                jugador.animations.stop();

                if (mira == 'left')
                {
                    jugador.frame = 0;
                }
                else
                {
                    jugador.frame = 5;
                }

                mira = 'idle';
            }
      }


  },

  salto: function(){
    jugador.body.velocity.y = -400;
  },

  onDown: function(){
      if (cursores.left.isDown)
      {
          jugador.body.velocity.x = -150;

          if (mira != 'left')
          {
              jugador.animations.play('left');
              mira = 'left';
          }
      }
      else if (cursores.right.isDown)
      {
          jugador.body.velocity.x = 150;

          if (mira != 'right')
          {
              jugador.animations.play('right');
              mira = 'right';
          }
      }
      else
      {
          if (mira != 'idle')
          {
              jugador.animations.stop();

              if (mira == 'left')
              {
                  jugador.frame = 0;
              }
              else
              {
                  jugador.frame = 5;
              }

              mira = 'idle';
          }
      }
      
      if (saltar.isDown && jugador.body.onFloor() && project.time.now > tiempoSalto)
      {
          jugador.body.velocity.y = -250;
          tiempoSalto = project.time.now + 750;
      }
    },

  update: function(){
    project.physics.arcade.collide(capa, jugador);

    jugador.body.velocity.x = 0;

    this.onTouch();
  
  },

  render: function(){
    project.debug.pointer(project.input.mousePointer);
  }
}
