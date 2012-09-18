define (['javascripts/kineticjs-4.0.1.js', 'javascripts/modernizr.custom.90822.js'], function() {
var CONST_SEPARATOR = '<separator>';
  /*
   * XML_handler
   *
   * This class is used save diagrams as XML files and load diagrams from XML files.
   */
  var XML_handler = {
    get_header_XML: function() {
      var str = '<?xml version="1.0" encoding="utf-8"?>\n<shapes>\n';
      return str;
    },
    get_footer_XML: function() {
      var str = '</shapes>';
      return str;
    },
    /*
     * convert_to_xml
     *
     * Converts given shape (1st paramerter) to XML string and returns it.
     * Returned XML can be used to save the given shape to a file.
     */
    convert_to_XML: function(shape) {
      var XMLString = '';
        var type = '';
        var CONST_TYPE_RECT = 'RECT';
        var CONST_TYPE_ARROW = 'ARROW';
  
        XMLString += '\t<shape ';
  
        if (shape instanceof Kinetic.Text) {
          type = CONST_TYPE_RECT;
          console.log('This is rect');
          XMLString += 'type="rect"';
        } else if (shape instanceof Kinetic.Line)
        {
          type = CONST_TYPE_ARROW;
          XMLString += 'type="arrow"';
          console.log('This is line');
        }
        
        switch (type)
        {
          case CONST_TYPE_RECT:
            {
              XMLString += this.XML_from_property(shape, 'getX', 'x')
              XMLString += this.XML_from_property(shape, 'getY', 'y')
              XMLString += this.XML_from_property(shape, 'getZIndex', 'zindex')
              XMLString += this.XML_from_property(shape, 'getHeight', 'height')
              XMLString += this.XML_from_property(shape, 'getWidth', 'width')
              XMLString += this.XML_from_property(shape, 'getCornerRadius', 'cornerradius')
              XMLString += this.XML_from_property(shape, 'getFill', 'fill')
              XMLString += '>';
              break;
            }
            
          case CONST_TYPE_ARROW:
            {
              //XMLString += this.XML_from_property(shape, 'getX', 'x')
              //XMLString += this.XML_from_property(shape, 'getY', 'y')
              var points = shape.getPoints();
                XMLString += this.XML_from_property(shape, 'getZIndex', 'zindex')
                XMLString += '>\n\t\t<coords>\n';
                
              for (var i = 0; i < points.length; i++)
              {
                XMLString += '\t\t\t<coord x="';  
                XMLString += points[i].x;
                XMLString += '" ';  
                XMLString += 'y="';  
                XMLString += points[i].y;
                XMLString += '"</coord>\n';  
              }
              XMLString += '\t\t</coords>\n\t';
  
              break;
            }
        }

        if (type === CONST_TYPE_RECT) {
          var txt = shape.getText();
          txt = txt.replace(/(^\s+|\s+$)/g,' ');
          if (txt != '') {
            XMLString += txt;
          }        
        }
        XMLString += '</shape>\n';
      return XMLString;
    },
    /*
     * XML_from_property
     *
     * Parameters:
     * obj - reference to the object (i.e. KineticJS shape type of object)
     * obj_property - name of the method to be called to retrieve the value from the given object
     * XMLAttribute - attribute name where to store the value from the given object
     *
     * Returns:
     * XML attribute with a given name and a value from the given object, using the given method.
     */
    XML_from_property: function(obj, obj_method, XMLAttribute, obj_property) {
      var str = ' ' + XMLAttribute;
      str += '="';
      if (obj_property === false || obj_property == undefined) {
        str += obj[obj_method]();      
      } else {
        str =+ obj[obj_property];
      }
      str += '"';
      return str;  
    }
    
  };

  var canvas_util = {
    /*
     * selectShape
     *
     * Returns KineticJS shape object from the given layer, from the given coordinates
     */
    selectShape: function (selection_layer, x, y) {
      var shape = null;
      // Select the item user clicked
      var point = [x, y];
      var shapes = selection_layer.getIntersections(point);
      if (shapes.length > 0) {
        shape = shapes[0];  
      }
      for (var i=0; i < shapes.length; i++)
      {
        var newshape = shapes[i];
        if (shape.getZIndex() < newshape.getZIndex()) {
          shape = shapes[i];
        }
      }        
      return shape;
    }
  };
  var wait_dialog = {
    timerID: 0,
    rect: null,
    txt: '',
    cycle: 1,
    UpdateLoading: function() {
      wait_dialog.cycle++;
      
      if (wait_dialog.cycle > 3) {
        wait_dialog.cycle = 1;
      }
      
      txt = 'Loading';
      for (var i = 0; i < wait_dialog.cycle; i++) {
        txt += '.';
      }
      
      rect.setText(txt);
      kinetic_obj.templayer.draw();
    },
    WaitDialog: function(displayDialog) {
      if (displayDialog) {
          rect = new Kinetic.Text({
          x: 200,
          y: 200,
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
          text: 'Loading'
        });
        
        // add the shape to the layer
        kinetic_obj.templayer.add(rect);
        kinetic_obj.templayer.draw();
        
        this.timerID = setInterval(wait_dialog.UpdateLoading, 100);
        
      } else {
        clearInterval(this.timerID);
        kinetic_obj.templayer.removeChildren();
        kinetic_obj.templayer.draw();
        
      }
    }    
  };

    // Menu object
  var popup_menu = {
    items: ['Cut', 'Copy', 'Paste', CONST_SEPARATOR, 'Edit shape', 'Edit text', 'Delete'],
    visible: false,
    popup_menu_layer: null,
    selected_shape: null,
    selectMenuAction: function(menulayer, x, y) {
      if (this.selected_shape != null) {
        var selecteditem = canvas_util.selectShape(menulayer, x, y);
        this.hidePopup(menulayer);
        
        if (selecteditem != null) {
          
          switch (selecteditem.getText()) {
            case this.items[5]: // Edit text
              {
                kinetic_obj.changeText(this.selected_shape);
                break;
              }
            
            case this.items[6]: // Delete
              {
                kinetic_obj.layer.remove(this.selected_shape);
                kinetic_obj.layer.draw();
                break;
              }
            
          }
        }
        
      }
    },
    hidePopup: function(menulayer) {
        menulayer.removeChildren();
        menulayer.draw();
        this.visible = false;
    },
    showPopup: function(menulayer, item, x, y) {
      /*
       * show_popup
       *
       * Displays popup menu on given canvas coordinates.
       * Popup is used to manipulate selected objects (edit text, delete etc.)
       */
      
        if (this.visible) {
          this.hidePopup(menulayer);
        }
        
        this.visible = true;
        this.selected_shape = item;
        var y_index = 0;  
        
        for (var i = 0; i < this.items.length; i++) {
          var rect = null;
          
          if (this.items[i] != CONST_SEPARATOR) {
            rect = new Kinetic.Text({
            x: x,
            y: y + y_index,
            width: 100,
            height: 20,
            text: this.items[i],
            fill: '#cccccc',
            stroke: '#cccccc',
            fontSize: 8,
            fontFamily: 'Calibri',
            textFill: '#000',
            strokeWidth: 0.5,
            cornerRadius: 0,
            padding: 5,
            align: 'left',
            shadow: {
              color: 'gray',
              blur: 1,
              offset: [5, 5],
              opacity: 0.1
              }
            });
            y_index += 20;
          } else {
            rect = new Kinetic.Rect({
            x: x,
            y: y + y_index,
            width: 100,
            height: 3,
            fill: '#dddddd',
            stroke: '#dddddd',
            strokeWidth: 0.5,
            cornerRadius: 0,
            padding: 5,
            align: 'left',
            shadow: {
              color: 'gray',
              blur: 1,
              offset: [5, 5],
              opacity: 0.1
              }
            });
            y_index += 3;
            
          }
            menulayer.add(rect);
  
        }
        menulayer.draw();
      }
  };
    
  var kinetic_obj = {
    stage: null,
    layer: new Kinetic.Layer(),
    templayer: new Kinetic.Layer(),
    popup_menu_layer: new Kinetic.Layer(),
    currentTool: '',
    drawing: false,
    latestitem: null,
    draw_start_x: 0,
    draw_start_y: 0,
    draw_end_x: 0,
    draw_end_y: 0,
    CurrentFileName: '',
    text_edit_shape: null,
    text_edit_string: '',
    cursorVisible: false,
    showCursor: function() {
      if (kinetic_obj.cursorVisible) {
        kinetic_obj.text_edit_shape.setText(kinetic_obj.text_edit_string);
        kinetic_obj.cursorVisible = false;
      } else {
        var newtext = kinetic_obj.text_edit_string + '|';
        kinetic_obj.text_edit_shape.setText(newtext);
        kinetic_obj.cursorVisible = true;
      }
      kinetic_obj.layer.draw(); 
    },
    // Select the shape user clicked / touched
    changeText: function(shape) {
      if (kinetic_obj.text_edit_shape == null) {
          kinetic_obj.text_edit_shape = shape;
          kinetic_obj.text_edit_string = '';
    
          kinetic_obj.text_edit_string = kinetic_obj.text_edit_shape.getText();
    
          // In non-touch environments, text is edited directly to the shape
          if (!Modernizr.touch) {
            kinetic_obj.cursorTimerID = setInterval(function(){kinetic_obj.showCursor()}, 500);                                
            kinetic_obj.text_edit_shape.setFill('#ffffff');
          // In touch environments, display text input box (TODO: figure out if there is more elegant way)
          } else {
            var newText = prompt('Enter new text', kinetic_obj.text_edit_shape.getText());
            kinetic_obj.text_edit_shape.setText(newText);
            kinetic_obj.text_edit_shape = null;
          }
      }
    },
    getRelativeCoords: function (event) {
      if (event.offsetX !== undefined && event.offsetY !== undefined) { return { x: event.offsetX, y: event.offsetY }; }
      return { x: event.layerX, y: event.layerY };
    },
    changeDragDrop: function(changeval) {
      var shapes = kinetic_obj.layer.getChildren();
      for (var i = 0; i < shapes.length; i++)
      {
        shapes[i].setDraggable(changeval);
      }
    },
    drawSelectionElement: function(drawtolayer, startx, starty, endx, endy, text) {
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
      
      var rect = new Kinetic.Rect({
        x: rectx,
        y: recty,
        width: rectwidth,
        height: rectheight,
        fill: '#ffffff',
        stroke: 'black',
        textFill: '#555',
        strokeWidth: 1,
        cornerRadius: 0,
        padding: 0,
      });
      
      drawtolayer.add(rect);
      drawtolayer.draw();  
    },
    drawArrowElement: function(drawtolayer, x1, y1, x2, y2) {
      var points = [];
      points.push(x1);
      points.push(y1);
      points.push(x2);
      points.push(y2);
      kinetic_obj.drawLineElement(drawtolayer, points);  
    },
    drawLineElement: function(drawtolayer, points) {
      var x = 0;
      var y = 0;
      var arrow = new Kinetic.Line({
        points: points,
        stroke: "black",
        strokeWidth: 2
        });
    
      kinetic_obj.latestitem = arrow;
      // add the shape to the layer
      drawtolayer.add(arrow);
      drawtolayer.draw();
    },
    drawRectElement: function(drawtolayer, startx, starty, endx, endy, text) {
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
        fill: '#aaaaaa',
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
      latestitem = rect;
    
      // add the shape to the layer
      drawtolayer.add(rect);
      drawtolayer.draw();
    
    },    
    drawDownHandler: function(event) {
      var x = 0;
      var y = 0;

      if (Modernizr.touch) {
        x = event.pageX;
        y = event.pageY;
      } else {
        var relativecoord = kinetic_obj.getRelativeCoords(event);
        x = relativecoord.x;
        y = relativecoord.y;
      }
      
      console.log('currenttool ' + kinetic_obj.currentTool);
      
      switch (kinetic_obj.currentTool) {
        case TOOL_SELECT:
          {
            if (!popup_menu.visible) {
              var item = canvas_util.selectShape(kinetic_obj.layer, x, y);
              if (item != null) {
                popup_menu.showPopup(kinetic_obj.popup_menu_layer, item, x, y);          
              } else {
                console.log('hide popup');
                popup_menu.hidePopup(kinetic_obj.popup_menu_layer);
              }
            } else {
              popup_menu.selectMenuAction(kinetic_obj.popup_menu_layer, x, y);
            }
            break;
          }
        
        case TOOL_ARROW:
        case TOOL_RECT:
          {
            //kinetic_obj.popup_menu.hidePopup(popup_menu_layer);
            kinetic_obj.drawing = true;
            kinetic_obj.draw_start_x = x;
            kinetic_obj.draw_start_y = y;              
            break;
          }
        
        case TOOL_TEXT: // Change text of the selected shape
          {
            //kinetic_obj.popup_menu.hidePopup(popup_menu_layer);
            kinetic_obj.changeText(canvas_util.selectShape(kinetic_obj.layer, x, y));
            break;
          }
        case TOOL_ADDCHILD:
          {
            kinetic_obj.popup_menu.hidePopup(popup_menu_layer);
            add_child = canvas_util.selectShape(layer, x, y);
            
            if (add_child != null){
              kinetic_obj.addChildNode(add_child);
            }
            
            break;
          }
        
        case TOOL_DELETE:
          {
            kinetic_obj.popup_menu.hidePopup(popup_menu_layer);
            var itemToDelete = canvas_util.selectShape(layer, x, y);
            
            if (itemToDelete != null) {
              kinetic_obj.layer.remove(itemToDelete);
              kinetic_obj.layer.draw();
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
      if (kinetic_obj.drawing) {
        if (!Modernizr.touch) {
          var relativecoord = kinetic_obj.getRelativeCoords(event);
          kinetic_obj.draw_end_x = relativecoord.x;
          kinetic_obj.draw_end_y = relativecoord.y;  
        } 
    
        switch (kinetic_obj.currentTool) {
          case TOOL_ARROW:
          {
            kinetic_obj.templayer.removeChildren();
            kinetic_obj.templayer.draw();
            kinetic_obj.drawing = false;
            kinetic_obj.drawArrowElement(kinetic_obj.layer, kinetic_obj.draw_start_x, kinetic_obj.draw_start_y, kinetic_obj.draw_end_x, kinetic_obj.draw_end_y);
            break;    
          }
          case TOOL_RECT:
          {
            kinetic_obj.templayer.removeChildren();
            kinetic_obj.templayer.draw();
            kinetic_obj.drawing = false;
            kinetic_obj.drawRectElement(kinetic_obj.layer, kinetic_obj.draw_start_x, kinetic_obj.draw_start_y, kinetic_obj.draw_end_x, kinetic_obj.draw_end_y);          
            break;      
          }
        }
      }
    },
    drawMoveHandler: function(event) {
      var x = 0;
      var y = 0;
      
      if (Modernizr.touch) {
        x = event.pageX;
        y = event.pageY;          
      } else {
        var relativecoord = kinetic_obj.getRelativeCoords(event);
        x = relativecoord.x;
        y = relativecoord.y;  
      }
      
      if (kinetic_obj.currentTool === TOOL_MOVE) {
            if (!Modernizr.touch) {
              var item = canvas_util.selectShape(kinetic_obj.layer, x, y);
              // if the cursor is currently hovering on top
              if (item != null) {
                kinetic_obj.templayer.removeChildren();
                var CONST_SELECTION_ITEM_SIZE = 4;
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() + (item.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + (item.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE,item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() + (item.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE + item.getHeight(), item.getX() + (item.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE + item.getHeight());
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE + item.getWidth(), item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE + item.getWidth(), item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
    
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() + item.getWidth() - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + item.getWidth() + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE);
                kinetic_obj.drawSelectionElement(kinetic_obj.templayer, item.getX() + item.getWidth() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getX() + item.getWidth() + CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE);
                
              } else {
                kinetic_obj.templayer.removeChildren();
                kinetic_obj.templayer.draw();
              }
            }
            
      }
      if (kinetic_obj.drawing === true) {
        draw_end_x = x;
        draw_end_y = y;
        kinetic_obj.templayer.removeChildren();
        kinetic_obj.templayer.draw();
        
        switch (kinetic_obj.currentTool) {
          case TOOL_ARROW:
            {
              kinetic_obj.drawArrowElement(kinetic_obj.templayer, kinetic_obj.draw_start_x, kinetic_obj.draw_start_y, x, y);
              break;
            }
          
          case TOOL_RECT:
            {
              kinetic_obj.drawRectElement(kinetic_obj.templayer, kinetic_obj.draw_start_x, kinetic_obj.draw_start_y, x, y);                    
              break;
            }        
        }
        
      }
      
    },
    keyDownHandler: function(event) {
      if (kinetic_obj.text_edit_shape != null) {
        switch (event.keyCode) {
          
          case 13: // enter
            {
              kinetic_obj.text_edit_shape.setText(kinetic_obj.text_edit_string);
              kinetic_obj.text_edit_shape.setFill('#aaaaaa');
              kinetic_obj.layer.draw();
              clearInterval(kinetic_obj.cursorTimerID); 
              kinetic_obj.text_edit_shape = null;                
              break;
            }
            
          case 8: // backspace
            {
              var currentString = kinetic_obj.text_edit_string;
              if (currentString.length > 1) {
                var newString = currentString.substr(0, currentString.length - 1);
                kinetic_obj.text_edit_string = newString;
              } else {
                kinetic_obj.text_edit_string = '';
              }
              kinetic_obj.text_edit_shape.setText(text_edit_string);
              kinetic_obj.layer.draw();                                 
              break;
            }
    
        default:
          {
            var currentString = kinetic_obj.text_edit_string;              
            var character = String.fromCharCode(event.keyCode);
            var newString = currentString.concat(character);
            kinetic_obj.text_edit_string = newString.toLowerCase();
            kinetic_obj.text_edit_shape.setText(kinetic_obj.text_edit_string);
            kinetic_obj.layer.draw();
            break;
          }
        }
      }
    },
    savefilecallback: function(error, stat) {
      
    },
    SaveFile: function(kineticLayer) {
      var writeToFile = XML_handler.get_header_XML();

      var shapes = kineticLayer.getChildren();
      for (var i = 0; i < shapes.length; i++)
      {
        var shape = shapes[i];      
        writeToFile += XML_handler.convert_to_XML(shape);
      }
      writeToFile += XML_handler.get_footer_XML();
      require(['ogle_dropbox_handler'], function(dropbox_handler) {
          //canvas_handler.waitdialog(true);
          dropbox_handler.authenticate();
          dropbox_handler.savecontents(kinetic_obj.CurrentFileName, writeToFile, kinetic_obj.savefilecallback);
      });    
    },
    LoadFile: function(error, data) {
      $(data).find('shape').each(function () {
        switch ($(this).attr('type')) {
          case TOOL_RECT:
            {
              console.log('RECT');
              var x = parseInt($(this).attr('x'));
              var y = parseInt($(this).attr('y'));
              var width = parseInt($(this).attr('width'));
              var height = parseInt($(this).attr('height'));
              var text = '';
              if ($(this).text() != '') {
                text = $(this).text();
              }
              kinetic_obj.drawRectElement(kinetic_obj.layer, x, y, x + width, y + height, text);
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
              kinetic_obj.drawLineElement(kinetic_obj.layer, points);
              break;
            }
        }
          wait_dialog.WaitDialog(false);
      });  
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
    if (Modernizr.touch) {
      el.addEventListener('touchstart', function(event) { kinetic_obj.drawDownHandler(event); });    
      el.addEventListener('touchend', function(event) { kinetic_obj.drawEndHandler(event); });    
      el.addEventListener('touchmove', function(event) { kinetic_obj.drawMoveHandler(event); });    
    } else {
      el.addEventListener('mousedown', function(event) { kinetic_obj.drawDownHandler(event); });    
      el.addEventListener('mouseup', function(event) { kinetic_obj.drawEndHandler(event); });    
      el.addEventListener('mousemove', function(event) { kinetic_obj.drawMoveHandler(event); });    
    }
    document.addEventListener('keydown', function(event) { kinetic_obj.keyDownHandler(event); });
  }
  
  function SetCurrentFileName(filename) {
    kinetic_obj.CurrentFileName = filename;  
  }
  
  function ToolBoxCallback(item) {
    kinetic_obj.currentTool = item;
    
    switch (kinetic_obj.currentTool) {
      case TOOL_SAVE: {
          kinetic_obj.SaveFile(kinetic_obj.layer);
        break;
      }
      case TOOL_MOVE:
      {
        kinetic_obj.changeDragDrop(true);        
        break;
      }
    default:
      {
        kinetic_obj.changeDragDrop(false);
        break;
      }
    }
  }
  
  return {
    init: init,
    stage: kinetic_obj.stage,
    layer: kinetic_obj.layer,
    templayer: kinetic_obj.templayer,
    popup_menu_layer: kinetic_obj.popup_menu_layer,
    currenttool: kinetic_obj.currentTool,
    toolboxcallback: ToolBoxCallback,
    loadfilecallback: kinetic_obj.LoadFile,
    waitdialog: wait_dialog.WaitDialog,
    setcurrentfilename: SetCurrentFileName
  }
  
});