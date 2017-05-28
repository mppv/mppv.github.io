var start = {

    preload: function(){
         project.load.image('ini', 'assets/img/project/inicio.jpg');
    },

    create: function () {
        // Agregar fondo
        project.add.sprite(0, 0, 'ini');
    },

    // reinicia el juego
    update: function () {
      if(project.input.activePointer.justPressed()) {
        project.state.start('juego');
      }
    }
}
