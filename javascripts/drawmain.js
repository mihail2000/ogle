{ // Main

require.config({
    urlArgs: 'bust=' + (new Date()).getTime()    
});

/*
 *  Entry point for draw screen 
 */
window.onload = function() {
    
    require(['toolbox', 'canvas_handler', 'dropbox_handler', 'fileNameBar', 'javascripts/lib/URI.js'], function(toolbox, canvas_handler, dropbox_handler, fileNameBar) {     
        // Check if filename was given as a parameter and give file handler the file name.
        var qs = URI(document.URL).query(true); 

        var fileparameter = qs['filename'];
        var newParam = qs['newdiagram'];
        var width = qs['width'];
        var height = qs['height'];
        if (width == undefined || height == undefined) {
            width = 800;
            height = 600;
        }

        fileNameBar.init(fileparameter);
        toolbox.setcallback(canvas_handler.toolboxcallback);
        canvas_handler.init(width, height);
        
        if (fileparameter != undefined) {
            dropbox_handler.authenticate();
            dropbox_handler.loadcontents(fileparameter, canvas_handler.loadfilecallback);
        } else {
            canvas_handler.initEmptyCanvas();
        }
    });

  var elem;
  if (document.getElementById && (elem = document.getElementById('container'))) {
      if (elem.style) elem.style.cursor = 'crosshair';
  }
}
    
} // end of Main

