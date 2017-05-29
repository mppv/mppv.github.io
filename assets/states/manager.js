/* PRESENTADO POR : Monica Patricia Pineda Vargas */


// Se inicializa el proyecto en Phaser
// Se le indica el tamanio
var project = new Phaser.Game(320, 480, Phaser.CANVAS, 'project');

// Estos son los estados a utilizar a lo largo de esta entrega
project.state.add('start', start);
project.state.add('juego', game);
project.state.add('ganar', win);
project.state.add('perder', lose);

// En cada estado, es necesario llamar al siguiente
// En este caso: start
project.state.start('start');
