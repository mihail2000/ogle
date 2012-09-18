{ // Main

require.config({
    urlArgs: 'bust=' + (new Date()).getTime()    
});

/*
 *  Entry point for draw screen 
 */
window.onload = function() {
    
    // Things need to happen in certain order. Load the toolbox first.
    require(['toolbox'], function(toolbox) {
        toolbox.init();
        require(['canvas_handler'], function(canvas_handler) {
            canvas_handler.init(); 
            toolbox.setcallback(canvas_handler.toolboxcallback);
            // Check if filename was given as a parameter and give file handler the file name.
            var fileparameter = window.location.search.replace( "?filename=", "" );
              if (fileparameter != '') {
                canvas_handler.setcurrentfilename(fileparameter);

                require(['ogle_dropbox_handler'], function(dropbox_handler) {
                    canvas_handler.waitdialog(true);
                    dropbox_handler.authenticate();
                    dropbox_handler.loadcontents(fileparameter, canvas_handler.loadfilecallback);
                });    
              }
        });
    });

  var elem;
  if (document.getElementById && (elem = document.getElementById('container'))) {
      if (elem.style) elem.style.cursor = 'crosshair';
  }
}
    
} // end of Main

