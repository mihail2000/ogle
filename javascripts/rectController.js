define (['selectionController'], function(selectionController) {
  
    function drawRectElement(drawtolayer, startx, starty, endx, endy, text, fill) {
      var rectx = 0;
      var recty = 0;
      var rectheight = 0;
      var rectwidth = 0;
              
      if (startx < endx) {
        rectx = startx;
        rectwidth = endx - startx;
      } else {
        rectx = endx;
        rectwidth = startx - endx;
      }
      
      if (starty < endy) {
        recty = starty;
        rectheight = endy - starty;
      } else {
        recty = endy;
        rectheight = starty - endy;
      }
      
      if (rectheight < 50) {
        rectheight = 50;              
      }
    
      if (rectwidth < 50) {
        rectwidth = 50;              
      }
            
      var rect = new Kinetic.Text({
        x: rectx,
        y: recty,
        width: rectwidth,
        height: rectheight,
        fill: fill,
        stroke: 'black',
        fontSize: 14,
        fontFamily: 'Calibri',
        textFill: '#555',
        strokeWidth: 1,
        cornerRadius: 10,
        padding: 20,
        align: 'center',
        shadow: {
          color: 'black',
          blur: 1,
          offset: [10, 10],
          opacity: 0.2
        }
      });
      
      if (text != '') {
        rect.setText(text);
      }
      //latestitem = rect;
    
      // add the shape to the layer
      drawtolayer.add(rect);
      drawtolayer.draw();
      return rect;
    
    }   

    return {
        drawRectElement: drawRectElement,
        selection: selectionController
    }

});