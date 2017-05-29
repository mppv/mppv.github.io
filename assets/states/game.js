/*

  PRESENTADO POR:
  Monica Patricia Pineda Vargass

  REFERENCIAS:
  Este trabajo se basa en los ejemplos Multi Touch y Starstruck de Phaser, 
  disponibles en https://phaser.io/examples

  Adicional a ello, para el soporte de Touch, fueron revisados diversos foros
  en el sitio: http://www.html5gamedevs.com/

  EXPLICACION:

  Las funciones preload, create y update son estandar del modelo de creacion
  de juegos y animaciones de Phaser.

  - En preload se cargan los recursos, que pueden ser imagenes,
  patrones, archivos json que determinan mapas, etc; 
  - En create se agregan los elementos al canvas de Phaser
  - En update se actualizan las acciones que nosotros determinemos para 
  los recursos cargados

  Adicional a ello, se pueden utilizar otras funciones, que pueden 
  acumular acciones comunes para un determinado recurso (por ejemplo,
  el movimiento de un jugador)

  Se cuenta con soporte tactil y de teclado


*/

// Se declaran las variables que se usaran a lo largo de este script
var nivel;
var puntaje;
var conjuntoPatrones;
var pantalla;
var capa;
var jugador;
var cursores;
var saltar;
var mira = 'left';
var tiempoSalto = 0;
// Maneja las acciones derecha e izquierda
var RIGHT = 0, LEFT = 1;
// Contador de llaves
var contador = 0;

// Esta funcion detecta cuando hay colision entre el jugador
// y el tile (cuadro) que contiene una llave
function hitkey(jugador, tile){
  // Si se encuentra por primera vez con el tile
  // incrementa el contador, luego cambia la transparencia
  // de la llave para que no incremente sin querer el contador
  // y actualiza el puntaje
  if(tile.alpha == 1)
    contador++;
  tile.alpha = 0.2;
  capa.dirty = true;
  puntaje.setText("Puntaje: " + contador);
  return false;
}

// Funcion de colision al perder
function hitpokeball(jugador, tile){
  // Cambia el estado cuando se encuentran con un tile de pokebolas
  project.state.start('perder');    
  return false;
}

// Se declara el estado game, el cual contiene todo el jugable
var game =  {
  // Son precargadas los recursos del juego (sprite de jugador, fondo, 
  // el laberinto en formato json, y el conjunto de texturas), ademas
  // con la llave (al reunirse se gana el juego) y la pokeball (que hace perder el juego)
  preload:function(){
    project.load.image('monkey', 'assets/img/project/Mankey.png');
    project.load.image('fondo', 'assets/img/project/sky.jpg');
    project.load.tilemap('textura', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON);
    project.load.image('Dungeon', 'assets/map/Dungeon_map.png');
    project.load.image('Key', 'assets/map/Key.png');
    project.load.image('Pokeball', 'assets/map/Pokeball.png');
    
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

    // Se carga la textura de las llaves, y estan incrustadas en el mapa
    // el numero 3073 corresponde a una asignacion por parte de Tiled
    // para que el json reconozca la imagen asociada, y ademas 
    // para que colisione con el jugador 
    nivel.addTilesetImage('Key');
    nivel.setTileIndexCallback(3073, hitkey, this);

    // de forma analoga a las llaves, 3048 corresponde a una pokeball
    nivel.addTilesetImage('Pokeball');
    nivel.setTileIndexCallback(3074, hitpokeball, this);

    //nivel.setTileLocationCallback(2, 0, 1, 1, this.hitkey, this);

    // y, se aniade como capa y se incorpora al tamanio del Canvas
    capa = nivel.createLayer('Ground');
    capa.resizeWorld();

    // a continuacion se presenta el puntaje, que es un texto que se muestra
    // en el mundo. Se indica el tipo de letra, que el texto vaya con la letra
    // y funciones de sombra
    puntaje = project.add.text(10, 10, "Puntaje: 0" , { font: "24px Bree Serif"} );
    puntaje.fixedToCamera = true;
    puntaje.addColor("#ecfcf9", 0);
    puntaje.stroke = '#000000';
    puntaje.strokeThickness = 2;
    // Se habilita la funcion ARCADE de Phaser, el cual implementa colisiones
    // y la funcion de gravedad de los elementos en el mundo
    project.physics.startSystem(Phaser.Physics.ARCADE);
    project.physics.arcade.gravity.y = 100;

    // Se carga el elemento jugable y se activan las funciones de Phaser
    // relacionadas con juegos ARCADE. Por otro lado, se habilita su opcion de 
    // colisionar, y finalmente, el tamanio de la colision, que no necesariamente
    // debe coincidir con la imagen cargada
    jugador = project.add.sprite(32, 32, 'monkey');
    jugador.name = 'monkey';
    project.physics.enable(jugador, Phaser.Physics.ARCADE);
    jugador.body.bounce.y = 0.2;
    jugador.body.collideWorldBounds = true;
    jugador.body.setSize(22, 22, 0, 0);

    // Se habilitan el jugador y la capa
    // en el mundo ARCADE de Phaser
    project.physics.arcade.enable([jugador, capa]);
    //efecto Rebote de Phaser
    //jugador.body.bounce.setTo(1, 1)

    // La camara sigue al jugador
    project.camera.follow(jugador);

    // Son habilitadas las acciones de teclado, y se llama a movimiento, que 
    // contiene las acciones de movimiento
    project.input.keyboard.addCallbacks(this,this.movement);
    cursores = project.input.keyboard.createCursorKeys();
    saltar = project.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Llama a salto cuando se toque con el mouse o con un dedo
    // Notese que cada vez que se toca, salta, asi este durante un salto
    // Esto solo esta disponible para touch y mouse
    project.input.onDown.add(this.jump, this);


  },

  // Contiene los efectos de touch y mouse
  onTouch: function(){
    if (project.input.activePointer.isDown) {
      // Se calcula la mitad de la pantalla, ahi se determina
      // como quiere mover el usuario el personaje
      if (Math.floor(project.input.x / (project.width / 2)) === LEFT) {
          // Movimiento a la izquierda 
          // Se fija su velocidad de avance en 150   
          jugador.body.velocity.x = 150;

          // Los condicionales comentados determinan
          // el movimiento de un sprite cargado con animacion,
          // esto con el fin de que el perfil de movimiento
          // concuerde con esta (por ejemplo, que mire a la izquierda mientras
          // se le de la indicacion de moverse a la izquierda)
          /*if (mira != 'left')
          {
                jugador.animations.play('left');
                mira = 'left';
          }*/
      }
      if (Math.floor(project.input.x / (project.width / 2)) === RIGHT) {
          //  Movimiento a la derecha  
          jugador.body.velocity.x = -150;
          // if (mira != 'right')
          //   {
          //       jugador.animations.play('right');
          //       mira = 'right';
          //   }
      }
      // Si el punto no esta presionado, el personaje no se mueve
      /*} else {
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
            }*/
      }


  },

  // funcion de salto
  jump: function(){
    // Se asigna la maxima altura del salto y su tiempo
    jugador.body.velocity.y = -150;
    tiempoSalto = project.time.now + 750;
  },

  // A continuacion se muestran las acciones de movimiento.
  // Son similares a las acciones de Touch, es decir, se comportan
  // de forma analoga, respecto a los movimientos
  movement: function(){
      if (cursores.left.isDown)
      {
          jugador.body.velocity.x = -150;

/*          if (mira != 'left')
          {
              jugador.animations.play('left');
              mira = 'left';
          }*/
      }
      else if (cursores.right.isDown)
      {
          jugador.body.velocity.x = 150;

          /*if (mira != 'right')
          {
              jugador.animations.play('right');
              mira = 'right';
          }*/
      }
/*      else
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
      }*/
      // Esta es la funcion de salto para teclado
      if (saltar.isDown && jugador.body.onFloor() && project.time.now > tiempoSalto)
      {
          jugador.body.velocity.y = -150;
          tiempoSalto = project.time.now + 750;
      }
    },

  /*

  ESTADO GANAR
  
  Certifica que el jugador se encuentre en la posicion del cofre
  y que haya encontrado 6 llaves en el recorrido propuesto

  En el caso que este en la posicion pero no este con todas las llaves
  se indica cuantas hacen falta
  */
  win: function(){
    if(jugador.x == 0 && jugador.y==1098){
      if(contador == 6){
        game.state.start('ganar');
      } else {
        puntaje.setText("Faltan " + (6-contador) + " llave(s).")
      }
    }
  },

  update: function(){
    // Se habilitan las opciones de colision entre capa y jugador
    project.physics.arcade.collide(capa, jugador);
    
    // Esta es la velocidad por defecto, es cero
    // Lo hacemos asi porque se movera con las acciones de teclado y touch
    jugador.body.velocity.x = 0;

    // funciones de touch
    this.onTouch();
    // estado ganar
    this.win();
  },

  // funcion de debug para descubrir posiciones en el mapa
  render: function(){
    //project.debug.text(jugador.x +  " * " + jugador.y, 64,64);
  }
    
}
