var start = {

    preload: function(){
         project.load.image('ini', 'assets/img/project/inicio.png');
    },

    create: function () {
        // Agregar fondo
        project.add.sprite(0, 0, 'ini');

        // enter guarda la acción de presionar R para reanudar el juego
        var enter = project.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Cuando presiona se cambia a esa acción
        enter.onDown.addOnce(this.start, this);
    },

    // reinicia el juego
    start: function () {
        project.state.start('juego');
    }
}
