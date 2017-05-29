//Tal y como si indico en el anterior estado, este es el primer estado
//que aparece en pantalla

/*
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


  Lo anterior se repite en game.js
*/
var start = {

    preload: function(){
         project.load.image('pantallaInicial', 'assets/img/project/inicio.jpg');
    },

    create: function () {
        // Agregar fondo
        project.add.sprite(0, 0, 'pantallaInicial');
         // enter guarda la acción de presionar ENTER para reanudar el juego
         // y luego se envia la senial de envio del cambio de estado
        var enter = project.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onDown.addOnce(this.start, this);
    },

    // pantallaInicialcia el juego, mediante el tactil, detectando si el usuario
    // ha presionado la pantalla, ya sea con el dedo o el mouse
    update: function () {
      if(project.input.activePointer.justPressed()) {
        project.state.start('juego');
      }
    },

    // pantallaInicialcia el juego mediante el teclado  
    start: function () {
        project.state.start('juego');    
    }  

}
