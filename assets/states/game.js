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


var game =  {
  preload:function(){
    project.load.image('monkey', 'assets/img/project/Mankey.png')
    // Se cargan el fondo y el laberinto a resolver
    project.load.image('fondo', 'assets/img/project/sky.jpg');
    project.load.tilemap('textura', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('Dungeon', 'assets/map/Dungeon_map.png');
    
  },

  create: function(){
    
    

    project.stage.backgroundColor = '#454645';
    pantalla = project.add.tileSprite(0, 0, 320, 480, 'fondo');
    pantalla.fixedToCamera = true;
    nivel = project.add.tilemap('textura');
    // El archivo anterior depende de la imagen que solicita tiles, puede verificarse en los assets.
    nivel.addTilesetImage('Dungeon');
    // Dentro del json, este es el nombre de ...
    nivel.setCollisionBetween(1, 2870);
    //nivel.setCollisionByExclusion([2880]);
    capa = nivel.createLayer('Ground');
    //capa.debug = true;
    capa.resizeWorld();
    project.physics.startSystem(Phaser.Physics.ARCADE);
    // Y se le da gravedad gracias a la libreria ARCADE de Phaser
    project.physics.arcade.gravity.y = 250;
    // Se carga el perro y su ubicación en el laberinto
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

    
    


  },

  onTouch: function(){
    if (project.input.activePointer.isDown) {
      if (Math.floor(project.input.x / (project.width / 2)) === LEFT) {
          //alert("vamos, izquierda");
          //  Move to the left      
          jugador.body.velocity.x = -150;
          if (mira != 'left')
          {
                jugador.animations.play('left');
                mira = 'left';
          }
      }
      if (Math.floor(project.input.x / (project.width / 2)) === RIGHT) {
          //  Move to the right    
          jugador.body.velocity.x = 150;
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
    //project.debug.pointer(project.input.pointer1);
    //project.debug.bodyInfo(jugador);
    //project.debug.text(project.time.physicsElapsed, 32, 32);
  }
}
