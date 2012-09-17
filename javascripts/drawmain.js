{ // Main

require.config({
    urlArgs: 'bust=' + (new Date()).getTime()    
});

window.onload = function() {
    require(['toolbox'], function(toolbox) {
        toolbox.init();
    });
    
    require(['canvas_handler'], function(canvas_handler) {
        canvas_handler.init();    
    });

    require(['ogle_dropbox_handler'], function(dropbox_handler) {        
        dropbox_handler.authenticate();
    });    
    
  var elem;
  if (document.getElementById && (elem = document.getElementById('container')) ) {
      if (elem.style) elem.style.cursor = 'crosshair';
  }
}
    
} // end of Main

