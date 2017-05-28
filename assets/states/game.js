var game =  {
  create: function(){
    project.stage.backgroundColor = '#454645';

    //  By default Phaser only starts 2 pointers (enough for 2 fingers at once)

    //  addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

    //  Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

    project.input.addPointer();
  },

  render: function(){
    project.debug.pointer(project.input.mousePointer);
  }
}
