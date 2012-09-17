define (['kineticjs-4.0.1'], function() {

  var kinetic_obj = {
    stage: null,
    layer: new Kinetic.Layer(),
    templayer: new Kinetic.Layer(),
    popup_menu_layer: new Kinetic.Layer(),
    drawDownHandler: function(event) {
      var x = 0;
      var y = 0;
      
      if (Modernizr.touch) {
        x = event.pageX;
        y = event.pageY;          
      } else {
        var relativecoord = getRelativeCoords(event);
        x = relativecoord.x;
        y = relativecoord.y;          
      }
      
      console.log('Current Tool: ' + currentTool);
      
      switch (currentTool) {
        case TOOL_SELECT:
          {
            if (!popup_menu.visible) {
              var item = selectShape(layer, x, y);
              if (item != null) {
                popup_menu.showPopup(popup_menu_layer, item, x, y);          
              } else {
                console.log('hide popup');
                popup_menu.hidePopup(popup_menu_layer);
              }
            } else {
              popup_menu.selectMenuAction(popup_menu_layer, x, y);
            }
            break;
          }
        
        case TOOL_ARROW:
        case TOOL_RECT:
          {
            popup_menu.hidePopup(popup_menu_layer);
            drawing = true;
            draw_start_x = x;
            draw_start_y = y;              
            break;
          }
        
        case TOOL_TEXT: // Change text of the selected shape
          {
            popup_menu.hidePopup(popup_menu_layer);
            changeText(selectShape(layer, x, y));
            break;
          }
        case TOOL_ADDCHILD:
          {
            popup_menu.hidePopup(popup_menu_layer);
            add_child = selectShape(layer, x, y);
            
            if (add_child != null){
              addChildNode(add_child);
            }
            
            break;
          }
        
        case TOOL_DELETE:
          {
            popup_menu.hidePopup(popup_menu_layer);
            var itemToDelete = selectShape(layer, x, y);
            
            if (itemToDelete != null) {
              layer.remove(itemToDelete);
              layer.draw();
              itemToDelete = null;
            }
            break;
          }
          
        default:
        {
          popup_menu.hidePopup(popup_menu_layer);
          break;
        }
      }
      
      
    },
    drawEndHandler: function(event) {
      
    },
    drawMoveHandler: function(event) {
      
    }
  };

  function init() {
    kinetic_obj.stage = new Kinetic.Stage({
      container: "container",
      x: 0,
      y: 0,
      width: 1240,
      height: 600
    });
    // add the layer to the stage
    kinetic_obj.stage.add(kinetic_obj.layer);
    kinetic_obj.stage.add(kinetic_obj.templayer);
    kinetic_obj.stage.add(kinetic_obj.popup_menu_layer);
    var el = document.getElementById('container');
    el.addEventListener('mousedown', function(event) { kinetic_obj.drawDownHandler(event); });    
    el.addEventListener('mouseup', function(event) { kinetic_obj.drawEndHandler(event); });    
    el.addEventListener('mousemove', function(event) { kinetic_obj.drawMoveHandler(event); });    
    
  /*
  if (Modernizr.touch) {
    el.addEventListener('touchstart', function(event) { drawDownHandler(event); });    
    el.addEventListener('touchend', function(event) { drawEndHandler(event); });    
    el.addEventListener('touchmove', function(event) { drawMoveHandler(event); });    
  } else {
    el.addEventListener('mousedown', function(event) { drawDownHandler(event); });    
    el.addEventListener('mouseup', function(event) { drawEndHandler(event); });    
    el.addEventListener('mousemove', function(event) { drawMoveHandler(event); });    
  }
  document.addEventListener('keydown', function(event) { keyDownHandler(event); });
  */
    
    
  }
  
  return {
    init: init,
    stage: kinetic_obj.stage,
    layer: kinetic_obj.layer,
    templayer: kinetic_obj.templayer,
    popup_menu_layer: kinetic_obj.popup_menu_layer
  }
  
});