define (function() {
    var baseWaitText = 'Loading'; // Text displayed on the dialog
    var CONST_TEXT_COLOR = '#ffffff'; // Wait text color
    var CONST_MAX_CYCLES = 3; // Maximum number of dots to be displayed after CONST_WAIT_TEXT
    
    var timerID = 0; // Store ID of timer used to update the wait dialog
    var kineticText = null; // Kinetic.Text object used to draw 'Loading...' text
    var cycle = 1; // How many dots to be displayed after CONST_WAIT_TEXT
    var drawToLayer = null; // Kinetic.Layer where to draw the wait dialog
  
    function updateLoading() {
        cycle++;
        if (cycle > CONST_MAX_CYCLES) {
          cycle = 1;
        }
        
        txt = baseWaitText;
        for (var i = 0; i < cycle; i++) {
          txt += '.';
        }
        
        kineticText.setText(txt);
        drawToLayer.draw();
    }
    
    function showWaitDialog(kineticLayer, waitText) {
        drawToLayer = kineticLayer;        
        kineticText = new Kinetic.Text({
        x: 100,
        y: 100,
        width: 300,
        height: 100,
        fill: '#ffffff',
        stroke: 'white',
        fontSize: 36,
        fontFamily: 'Calibri',
        textFill: '#555',
        strokeWidth: 0,
        cornerRadius: 0,
        padding: 20,
        align: 'left',
        text: waitText
        });
        baseWaitText = waitText;
        // add the shape to the layer
        drawToLayer.setZIndex(999);
        drawToLayer.add(kineticText);
        drawToLayer.draw();
        
        timerID = setInterval(updateLoading, 100);
  }
  
  function hideWaitDialog() {
      clearInterval(timerID);
      if (drawToLayer != null) {
          drawToLayer.removeChildren();
          drawToLayer.draw();
      }
  }
  
  return {
    showWaitDialog: showWaitDialog,
    hideWaitDialog: hideWaitDialog
  }
});