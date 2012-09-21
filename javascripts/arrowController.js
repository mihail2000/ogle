define (['selectionController'], function(selectionController) {

    var CONST_ID = 'line';
    
    var drawing = false;

    function drawArrowElement(drawtolayer, x1, y1, x2, y2) {
      var points = [];
      points.push(x1);
      points.push(y1);
      points.push(x2);
      points.push(y2);
      drawLineElement(drawtolayer, points);  
    }
  
    function drawLineElement(drawtolayer, points) {
      var x = 0;
      var y = 0;
      var arrow = new Kinetic.Line({
        points: points,
        stroke: "black",
        strokeWidth: 2
        });
      
      //latestitem = arrow;
      // add the shape to the layer
      drawtolayer.add(arrow);
      drawtolayer.draw();
    }

    function startEvent(layer, templayer, x, y) {
        drawing = true;
        draw_start_x = x;
        draw_start_y = y;              
    }
    
    function endEvent(layer, templayer, x, y) {
        templayer.removeChildren();
        templayer.draw();
        drawing = false;
        drawArrowElement(layer, draw_start_x, draw_start_y, draw_end_x, draw_end_y);        
    }
    
    function moveEvent(layer, templayer, x, y) {
        if (drawing) {
            draw_end_x = x;
            draw_end_y = y;
            templayer.removeChildren();
            templayer.draw();
            drawArrowElement(templayer, draw_start_x, draw_start_y, x, y, '', '#aaaaaa');                                
        }
    }

    function getId() {
        return CONST_ID;
    }


return {
    drawLineElement: drawLineElement,
    drawArrowElement: drawArrowElement,
    startEvent: startEvent,
    moveEvent: moveEvent,
    endEvent: endEvent,
    keyDownEvent: null,
    getId: getId    
    }
});