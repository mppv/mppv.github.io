// Accion de ganar, y vuelve al estado inicial
var win = {

    preload: function(){
         project.load.image('victoria', 'assets/img/project/ganaste.jpg');
    },

    create: function () {
        // Agregar fondo
        project.add.sprite(0, 0, 'victoria');

        // enter guarda la acción de presionar R para reanudar el juego
        var enter = project.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
        // Cuando presiona se cambia a esa acción
        enter.onDown.addOnce(this.start, this);

        /* Resetea la cantidad de diplomas en cada juego */
        contador = 0;
    },

    update: function () {
      if(project.input.activePointer.justPressed()) {
        project.state.start('start');
      }
    },
    
    // reinicia el juego   
    start: function () {
        project.state.start('start');    
    }	
}