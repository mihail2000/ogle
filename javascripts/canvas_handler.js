define (['dropbox_handler', 'canvasUtil', 'popupMenu', 'fileNameBar', 'canvasWaitDialog', 'rectController', 'javascripts/lib/kineticjs-4.0.1.js', 'javascripts/lib/modernizr.custom.90822.js', 'javascripts/lib/colorpicker/colorpicker.js', 'shapeToXML'], function(dropbox_handler, canvas_util, popupMenu, fileNameBar, canvasWaitDialog, rectController) {

  var TOOL_SELECT = 'select';
  var TOOL_MOVE = 'move';
  var TOOL_RECT = 'rect';
  var TOOL_ARROW = 'arrow';
  var TOOL_TEXT = 'settext';
  var TOOL_ADDCHILD = 'addchild';
  var TOOL_DELETE = 'delete';
  var TOOL_LOAD = 'load';
  var TOOL_SAVE = 'save';
  var TOOL_COLOR = 'color';
  var CONST_SELECTION_ITEM_SIZE = 6;
  
  var RESIZE_TOP_LEFT = 1;
  var RESIZE_TOP_CENTER = 2;
  var RESIZE_TOP_RIGHT = 3;
  var RESIZE_LEFT_CENTER = 4;
  var RESIZE_RIGHT_CENTER = 5;
  var RESIZE_BOTTOM_LEFT = 6;
  var RESIZE_BOTTOM_CENTER = 7;
  var RESIZE_BOTTOM_RIGHT = 8;
  
  var stage = null;
  var layer = new Kinetic.Layer();
  var templayer = new Kinetic.Layer();
  var popupMenu_layer = new Kinetic.Layer();
  var currentTool = '';
  var drawing = false;
  var latestitem = null;
  var draw_start_x = 0;
  var draw_start_y = 0;
  var draw_end_x = 0;
  var draw_end_y = 0;
  var text_edit_shape = null;
  var text_edit_string = '';
  var cursorVisible = false;
  var itemSelected = null;
  var resizeEnabled = 0;
    
    function showCursor()  {
      if (cursorVisible) {
        text_edit_shape.setText(text_edit_string);
        cursorVisible = false;
      } else {
        var newtext = text_edit_string + '|';
        text_edit_shape.setText(newtext);
        cursorVisible = true;
      }
      layer.draw(); 
    }
    
    // Select the shape user clicked / touched
    function changeText(shape) {
      if (text_edit_shape == null) {
          text_edit_shape = shape;
          text_edit_string = '';
    
          text_edit_string = text_edit_shape.getText();
    
          // In non-touch environments, text is edited directly to the shape
          if (!Modernizr.touch) {
            cursorTimerID = setInterval(function(){showCursor()}, 500);                                
            text_edit_shape.setFill('#ffffff');
          // In touch environments, display text input box (TODO: figure out if there is more elegant way)
          } else {
            var newText = prompt('Enter new text', text_edit_shape.getText());
            text_edit_shape.setText(newText);
            text_edit_shape = null;
          }
      }
    }
    
    function getRelativeCoords(event) {
      if (event.offsetX !== undefined && event.offsetY !== undefined) { return { x: event.offsetX, y: event.offsetY }; }
      return { x: event.layerX, y: event.layerY };
    }
    
    function changeDragDrop(changeval) {
      var shapes = layer.getChildren();
      for (var i = 0; i < shapes.length; i++)
      {
        shapes[i].setDraggable(changeval);
      }
    }
    
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
    
      latestitem = arrow;
      // add the shape to the layer
      drawtolayer.add(arrow);
      drawtolayer.draw();
    }
      
    function resizeElement(x, y) {
        var newheight = 0;
        var newwidth = 0;
        var newX = 0;
        var newY = 0;
        
        if (latestitem instanceof Kinetic.Text) {
          switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_TOP_RIGHT:
            case RESIZE_TOP_CENTER: {
               if (y > latestitem.getY()) {
                newheight = latestitem.getHeight() - (y - latestitem.getY());
              } else {
                newheight = latestitem.getHeight() + (latestitem.getY() - y);                
              }
              break;
            }
           case RESIZE_BOTTOM_LEFT:
           case RESIZE_BOTTOM_RIGHT:
            case RESIZE_BOTTOM_CENTER: {
              if (y > (latestitem.getY() + latestitem.getHeight()) ) {
                newheight = latestitem.getHeight() + (y - (latestitem.getY() + latestitem.getHeight()));
              } else {
                newheight = latestitem.getHeight() - ((latestitem.getY() + latestitem.getHeight()) - y);
              }
              break;
            }
          }
          
          switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_BOTTOM_LEFT:
            case RESIZE_LEFT_CENTER: {
               if (x > latestitem.getX()) {
                newwidth = latestitem.getWidth() - (x - latestitem.getX());
              } else {
                newwidth = latestitem.getWidth() + (latestitem.getX() - x);                
              }
              break;
            }
          case RESIZE_TOP_RIGHT: 
          case RESIZE_BOTTOM_RIGHT:
          case RESIZE_RIGHT_CENTER: {
            if (x > (latestitem.getX() + latestitem.getWidth() )) {
              newwidth = latestitem.getWidth() + (x -(latestitem.getX() + latestitem.getWidth()));
            } else {
              newwidth = latestitem.getWidth() + (x -(latestitem.getX() + latestitem.getWidth()));                
            }
            break;  
            }
            
          }
  
          switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:{
              newX = x;
              newY = y;
              break;
            }
           case RESIZE_BOTTOM_LEFT: {
            newY = latestitem.getY();
            newX = x;
            break;
           }
           case RESIZE_TOP_RIGHT: {
            newY = y;
            newX = latestitem.getX();
  
            break;
           }
            case RESIZE_BOTTOM_RIGHT: {
            newY = latestitem.getY();
            newX = latestitem.getX();
            break;
            }
            case RESIZE_TOP_CENTER: {
             newX = latestitem.getX();
             newwidth = latestitem.getWidth();
             newY = y;
             break; 
            }
            case RESIZE_BOTTOM_CENTER: {
             newX = latestitem.getX();
             newwidth = latestitem.getWidth();
             newY = latestitem.getY();
             break; 
            }
            case RESIZE_LEFT_CENTER: {
             newY = latestitem.getY();
             newheight = latestitem.getHeight();
             newX = x;
             break; 
            }
            case RESIZE_RIGHT_CENTER: {
             newY = latestitem.getY();
             newheight = latestitem.getHeight();
             newX = latestitem.getX();           
             break; 
            }
          }
  
          latestitem.setWidth(newwidth);
          latestitem.setHeight(newheight);
          latestitem.setX(newX);
          latestitem.setY(newY);        
      } else if (latestitem instanceof Kinetic.Line) {
        
      }
        layer.draw();
    }
    
    function drawDownHandler(event) {
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
      
      popupMenu.selectionListener(x, y);
      
      console.log('currenttool ' + currentTool);
      console.log(popupMenu);
      
      switch (currentTool) {
        case TOOL_SELECT:
          {
            //var item = canvas_util.selectShape(layer, x, y);
            //if (item != null) {
             // itemSelected = item;
              itemSelected = rectController.selection.handleSelection(layer, templayer, x, y);    
             // displaySelection(item);  
            //}
            

           /* 
            if (!popupMenu.visible) {
              var item = canvas_util.selectShape(layer, x, y);
              if (item != null) {
                popupMenu.showPopup(popupMenu_layer, x, y, function(id) {
                  alert('popup selected: ' + id);
                });          
              } else {
                console.log('hide popup');
                popupMenu.hidePopup(popupMenu_layer);
              }
            } else {
              popupMenu.selectMenuAction(popupMenu_layer, x, y);
            }
            */
            break;
          }
        case TOOL_MOVE:
          {
            console.log('selectionVisible ' + rectController.selection.getSelectionVisible());
            if (rectController.selection.getSelectionVisible()) {
              resizeEnabled = rectController.selection.getSelectionPoint(templayer, x, y);
            
              var item = canvas_util.selectShape(templayer, x, y);
              if (item != null && latestitem != null && latestitem instanceof Kinetic.Text) {
                rectController.selection.hideRectSelection();
                console.log('resize enabled');
                console.log('resize corner: ' + resizeEnabled);
              }
            }
            break;
          }
        case TOOL_ARROW:
        case TOOL_RECT:
          {
            //popupMenu.hidePopup(popupMenu_layer);
            drawing = true;
            draw_start_x = x;
            draw_start_y = y;              
            break;
          }
        
        case TOOL_TEXT: // Change text of the selected shape
          {
            //popupMenu.hidePopup(popupMenu_layer);
            changeText(canvas_util.selectShape(layer, x, y));
            break;
          }
        
        case TOOL_DELETE:
          {
            popupMenu.hidePopup(popupMenu_layer);
            var itemToDelete = canvas_util.selectShape(layer, x, y);
            
            if (itemToDelete != null) {
              layer.remove(itemToDelete);
              layer.draw();
              itemToDelete = null;
            }
            break;
          }
          
        default:
        {
          popupMenu.hidePopup(popupMenu_layer);
          break;
        }
      }
    }
    
    function drawEndHandler(event) {
      resizeEnabled = 0;
      if (drawing) {
        if (!Modernizr.touch) {
          var relativecoord = getRelativeCoords(event);
          draw_end_x = relativecoord.x;
          draw_end_y = relativecoord.y;  
        } 
    
        switch (currentTool) {
          case TOOL_ARROW:
          {
            templayer.removeChildren();
            templayer.draw();
            drawing = false;
            drawArrowElement(layer, draw_start_x, draw_start_y, draw_end_x, draw_end_y);
            break;    
          }
          case TOOL_RECT:
          {
            templayer.removeChildren();
            templayer.draw();
            drawing = false;
            latestItem = rectController.drawRectElement(layer, draw_start_x, draw_start_y, draw_end_x, draw_end_y, '', '#aaaaaa');          
            break;      
          }
        }
      }
    }
    
    function drawMoveHandler(event) {
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
      
      if (currentTool === TOOL_MOVE) {
        rectController.selection.handleSelection(layer, templayer, x, y);
        console.log('move ' + rectController.selection.getSelectionVisible());
      }
        
      if (drawing === true) {
        draw_end_x = x;
        draw_end_y = y;
        templayer.removeChildren();
        templayer.draw();
        
        switch (currentTool) {
          case TOOL_ARROW:
            {
              drawArrowElement(templayer, draw_start_x, draw_start_y, x, y);
              break;
            }
          
          case TOOL_RECT:
            {
              latestItem = rectController.drawRectElement(templayer, draw_start_x, draw_start_y, x, y, '', '#aaaaaa');                    
              break;
            }        
        } 
      }     
    }
  
    
    function keyDownHandler(event) {
      if (text_edit_shape != null) {
        switch (event.keyCode) {
          
          case 13: // enter
            {
              text_edit_shape.setText(text_edit_string);
              text_edit_shape.setFill('#aaaaaa');
              layer.draw();
              clearInterval(cursorTimerID); 
              text_edit_shape = null;                
              break;
            }
            
          case 8: // backspace
            {
              var currentString = text_edit_string;
              if (currentString.length > 1) {
                var newString = currentString.substr(0, currentString.length - 1);
                text_edit_string = newString;
              } else {
                text_edit_string = '';
              }
              text_edit_shape.setText(text_edit_string);
              layer.draw();                                 
              break;
            }
    
        default:
          {
            var currentString = text_edit_string;              
            var character = String.fromCharCode(event.keyCode);
            var newString = currentString.concat(character);
            text_edit_string = newString.toLowerCase();
            text_edit_shape.setText(text_edit_string);
            layer.draw();
            break;
          }
        }
      }
    }
    
    function savefilecallback(error, stat) {
     
    }
    
    function SaveFile(kineticLayer) {
      
      var writeToFile = '';
      var shapes = kineticLayer.getChildren();
      
      var xmlConverter = new shapeToXML();
      writeToFile = xmlConverter.convertToXML(shapes);

      if (writeToFile != '') {
        //require(['dropbox_handler'], function(dropbox_handler) {
            dropbox_handler.authenticate();
            dropbox_handler.savecontents(fileNameBar.getFileName(), writeToFile, savefilecallback);
        //});    
      }

    }
    
    function LoadFile(error, data) {
      $(data).find('shape').each(function () {
        switch ($(this).attr('type')) {
          case TOOL_RECT:
            {
              console.log('RECT');
              var x = parseInt($(this).attr('x'));
              var y = parseInt($(this).attr('y'));
              var width = parseInt($(this).attr('width'));
              var height = parseInt($(this).attr('height'));
              var fill = $(this).attr('fill');
              var text = '';
              if ($(this).text() != '') {
                text = $(this).text();
              }
              latestItem = rectController.drawRectElement(layer, x, y, x + width, y + height, text, fill);
              break;
            }
          
          case TOOL_ARROW:
            {
              console.log('ARROW');
              var points = [];
              $(this).find('coord').each(function () {
                points.push(parseInt($(this).attr('x')));
                points.push(parseInt($(this).attr('y')));
              });
              drawLineElement(layer, points);
              break;
            }
        }
      });
      canvasWaitDialog.hideWaitDialog();
      latestitem = null;

    }
  
  function init() {
    stage = new Kinetic.Stage({
      container: "container",
      x: 0,
      y: 0,
      width: 1240,
      height: 600
    });
    // add the layer to the stage
    stage.add(layer);
    stage.add(templayer);
    stage.add(popupMenu_layer);
    
    canvasWaitDialog.showWaitDialog(templayer);
    
    var el = document.getElementById('container');
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
    
    $('#radio9').ColorPicker({
     color: '#0000ff',
     onShow: function (colpkr) {
             $(colpkr).fadeIn(200);
             return false;
     },
     onHide: function (colpkr) {
             $(colpkr).fadeOut(200);
             return false;
     },
     onChange: function(hsb, hex, rgb) {
       if (itemSelected != null) {
         console.log('itemselected');
         itemSelected.setFill(hex);
         layer.draw();
       }
     }
     });
  }
  
  function ToolBoxCallback(item) {
    currentTool = item;
    
    switch (item) {
      case TOOL_SAVE: {
          SaveFile(layer);
        break;
      }
      case TOOL_MOVE:
      {
        changeDragDrop(true);        
        break;
      }
      case TOOL_COLOR:
      {
        console.log(itemSelected);
       break;
      }
    default:
      {
        changeDragDrop(false);
        break;
      }
    }
  }
  
  init();
  
  return {
    stage: stage,
    layer: layer,
    templayer: templayer,
    popupMenu_layer: popupMenu_layer,
    currenttool: currentTool,
    toolboxcallback: ToolBoxCallback,
    loadfilecallback: LoadFile
  }
});