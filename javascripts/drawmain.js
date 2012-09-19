{ // Main

require.config({
    urlArgs: 'bust=' + (new Date()).getTime()    
});

/*
 *  Entry point for draw screen 
 */
window.onload = function() {
    require(['toolbox', 'canvas_handler', 'dropbox_handler'], function(toolbox, canvas_handler, dropbox_handler) {     
        toolbox.init();
        canvas_handler.init(); 
        toolbox.setcallback(canvas_handler.toolboxcallback);
        // Check if filename was given as a parameter and give file handler the file name.
        var fileparameter = window.location.search.replace( "?filename=", "" );
        canvas_handler.setcurrentfilename(fileparameter);
        canvas_handler.waitdialog(true);
        dropbox_handler.authenticate();
        dropbox_handler.loadcontents(fileparameter, canvas_handler.loadfilecallback);
    });

  var elem;
  if (document.getElementById && (elem = document.getElementById('container'))) {
      if (elem.style) elem.style.cursor = 'crosshair';
  }
}
    
} // end of Main

