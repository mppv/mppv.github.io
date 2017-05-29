var project = new Phaser.Game(320, 480, Phaser.CANVAS, 'project');

// A continuación se muestran los estados del juego
// Este contiene el inicio del juego, que inicia cuando el usuario presiona ENTER
project.state.add('start', start);
// Estado "jugar"
project.state.add('juego', game);
// Estado "ganar"
project.state.add('ganar', win);
// Estado "perder"
//project.state.add('perder', lose);

// Se llama al primer estado
project.state.start('start');
