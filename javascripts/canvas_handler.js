define (['dropbox_handler', 'canvasUtil', 'popupMenu', 'fileNameBar', 'canvasWaitDialog', 'rectController', 'selectionController', 'arrowController', 'javascripts/lib/kineticjs-4.0.1.js', 'javascripts/lib/modernizr.custom.90822.js', 'javascripts/lib/colorpicker/colorpicker.js', 'shapeToXML'], function(dropbox_handler, canvas_util, popupMenu, fileNameBar, canvasWaitDialog, rectController, selectionController, arrowController) {

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
  var layer = null; 
  var templayer = null;
  var popupMenu_layer = null;
  var waitDialogLayer = new Kinetic.Layer({id: 'waitDialogLayer'});
  
  
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
  
  var controllers = []; // Array of controllers handling mouse, touch and keyboard events
    
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
    console.log(layer);
    var shapes = layer.getChildren();
    for (var i = 0; i < shapes.length; i++)
    {
      shapes[i].setDraggable(changeval);
    }
  }
    /*
     * getControllerById
     *
     * Retrieves a canvas controller class based on the given id.
     * Id represents the currently selected tool (drawing, selection, moving etc.)
     *
     * Parameters:
     *  id - id of the controller to be retrieved
     *
     * Returns:
     *  Controller object with the given id
     */
    function getControllerById(id) {
      var controller = null;
      for (var i = 0; i < controllers.length; i++) {
        controller = controllers[i];
        if (controller.getId() === id) {
          return i;
        }
      }
      return null; // Should never occur if used as should.
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

    var controller = controllers[getControllerById(currentTool)];
    if (controller != null) {
      controller.startEvent(layer, templayer, x, y);
    } else {        
      popupMenu.selectionListener(x, y);
      
      console.log('currenttool ' + currentTool);
      console.log(popupMenu);
      
      switch (currentTool) {
        case TOOL_SELECT:
          {
            var item = canvas_util.selectShape(layer, x, y);
            if (item != null) {
              itemSelected = item;
              selectionController.showRectSelection(templayer, itemSelected);
            }

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
            break;
          }
        case TOOL_ARROW:
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
  }
    
  function drawEndHandler(event) {
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

    /*if (drawing) {
      if (!Modernizr.touch) {
        var relativecoord = getRelativeCoords(event);
        draw_end_x = relativecoord.x;
        draw_end_y = relativecoord.y;  
      }
      
    }
*/
    var controller = controllers[getControllerById(currentTool)];
    if (controller != null) {
      controller.endEvent(layer, templayer, x, y);
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
    
    var controller = controllers[getControllerById(currentTool)];
    if (controller != null) {
      controller.moveEvent(layer, templayer, x, y);
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
    
    var progressval = 0;
    var progressID = 0;
    var progressDirection = 10;
    
    function progressBarUpdate() {
      progressval+=progressDirection;
      if (progressval > 100) {
        progressDirection = -10;
      } else if (progressval < 10) {
        progressDirection = 10;
      }
 
      $( "#progressbar" ).progressbar({
              value: progressval
      });
      $("#progressbar").show();
      $("#progressdiv").show();

    }
    function savefilecallback(error, stat) {
      clearInterval(progressID);
      
      $("#progressbar").hide();
      $("#progressdiv").hide();
      
    }
    
    function SaveFile(kineticLayer) {

      progressDirection = 10;
      progressval = 0;
      progressID = setInterval(progressBarUpdate, 100);
    
      var writeToFile = '';
      //var shapes = kineticLayer.getChildren();
      
      //var xmlConverter = new shapeToXML();
      //writeToFile = xmlConverter.convertToXML(shapes);
      writeToFile = stage.toJSON();
      
      if (writeToFile != '') {
        //require(['dropbox_handler'], function(dropbox_handler) {
            dropbox_handler.authenticate();
            dropbox_handler.savecontents(fileNameBar.getFileName(), writeToFile, savefilecallback);
        //});    
      }

      
    }
    
    function LoadFile(error, data) {
      console.log('LoadFile error: ' + error);
      if (error == null) {
        console.log(data);
        var json = '{"attrs":{"width":578,"height":200,"throttle":80,"visible":true,"listening":true,"alpha":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"dragConstraint":"none","dragBounds":{},"draggable":false},"nodeType":"Stage","children":[{"attrs":{"throttle":80,"clearBeforeDraw":true,"visible":true,"listening":true,"alpha":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"dragConstraint":"none","dragBounds":{},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"radius":70,"sides":6,"detectionType":"path","visible":true,"listening":true,"alpha":1,"x":289,"y":100,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"dragConstraint":"none","dragBounds":{},"draggable":false,"fill":"red","stroke":"black","strokeWidth":4},"nodeType":"Shape","shapeType":"RegularPolygon"}]}]}';
        stage.load(data);
        
        layer = stage.get('#layer')[0];
        templayer = stage.get('#templayer')[0];
        popupMenu_layer = stage.get('#popupmenulayer')[0];
        
        initControllers();
        
      }
      canvasWaitDialog.hideWaitDialog();
      latestitem = null;

    }
 
  function initControllers() {
    // TODO: Implement LoadControllers in a separate javascript file. Ideally this would be something that can be changed without touching this particular class.
    controllers.push(selectionController);
    controllers.push(rectController);
    controllers.push(arrowController);
    
    var el = document.getElementById('container');
    if (Modernizr.touch) {
      el.addEventListener('touchstart', function(event) { drawHandler(event); });    
      el.addEventListener('touchend', function(event) { drawEndHandler(event); });    
      el.addEventListener('touchmove', function(event) { drawMoveHandler(event); });    
    } else {
      el.addEventListener('mousedown', function(event) { drawDownHandler(event); });    
      el.addEventListener('mouseup', function(event) { drawEndHandler(event); });    
      el.addEventListener('mousemove', function(event) { drawMoveHandler(event); });    
    }
    document.addEventListener('keydown', function(event) { keyDownHandler(event); });    
    
  }
  
  function initEmptyCanvas() {
    // add the layer to the stage
    
    layer = new Kinetic.Layer({id: 'layer'});
    templayer = new Kinetic.Layer({id: 'templayer'});
    popupMenu_layer = new Kinetic.Layer({id: 'popupmenulayer'});
    stage.add(layer);
    stage.add(templayer);
    stage.add(popupMenu_layer);
    
    initControllers();
    
    canvasWaitDialog.hideWaitDialog();

  }
  
  function init(w, h) {
    stage = new Kinetic.Stage({
      container: "container",
      x: 0,
      y: 0,
      width: w,
      height: h
    });
    
    stage.add(waitDialogLayer);
    canvasWaitDialog.showWaitDialog(waitDialogLayer, 'Loading');
    $("#progressdiv").hide();

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
  
  //init();
  
  return {
    stage: stage,
    layer: layer,
    templayer: templayer,
    popupMenu_layer: popupMenu_layer,
    currenttool: currentTool,
    toolboxcallback: ToolBoxCallback,
    loadfilecallback: LoadFile,
    initEmptyCanvas: initEmptyCanvas,
    init: init
  }
});