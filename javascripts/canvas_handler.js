define (['javascripts/lib/kineticjs-4.0.1.js', 'javascripts/lib/modernizr.custom.90822.js'], function() {
var TOOL_SELECT = 'select';
var TOOL_MOVE = 'move';
var TOOL_RECT = 'rect';
var TOOL_ARROW = 'arrow';
var TOOL_TEXT = 'settext';
var TOOL_ADDCHILD = 'addchild';
var TOOL_DELETE = 'delete';
var TOOL_LOAD = 'load';
var TOOL_SAVE = 'save';
var CONST_SELECTION_ITEM_SIZE = 6;

var RESIZE_TOP_LEFT = 1;
var RESIZE_TOP_CENTER = 2;
var RESIZE_TOP_RIGHT = 3;
var RESIZE_LEFT_CENTER = 4;
var RESIZE_RIGHT_CENTER = 5;
var RESIZE_BOTTOM_LEFT = 6;
var RESIZE_BOTTOM_CENTER = 7;
var RESIZE_BOTTOM_RIGHT = 8;
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
    },
    isBetween: function(number, lower, higher) {
      var retval = false;
      
      if (number >= lower && number <= higher) {
        retval = true;
      }
      
      return retval;
      
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
    
  var kinetic_obj = {
    stage: null,
    layer: new Kinetic.Layer(),
    templayer: new Kinetic.Layer(),
    popup_menu_layer: new Kinetic.Layer(),
    popup_menu: null,
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
    selectionVisible: false,
    resizeEnabled: 0,
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
    
      this.latestitem = arrow;
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
    resizeElement: function(x, y) {
        var newheight = 0;
        var newwidth = 0;
        var newX = 0;
        var newY = 0;
        
        if (this.latestitem instanceof Kinetic.Text) {
          switch (this.resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_TOP_RIGHT:
            case RESIZE_TOP_CENTER: {
               if (y > this.latestitem.getY()) {
                newheight = this.latestitem.getHeight() - (y - this.latestitem.getY());
              } else {
                newheight = this.latestitem.getHeight() + (this.latestitem.getY() - y);                
              }
              break;
            }
           case RESIZE_BOTTOM_LEFT:
           case RESIZE_BOTTOM_RIGHT:
            case RESIZE_BOTTOM_CENTER: {
              if (y > (this.latestitem.getY() + this.latestitem.getHeight()) ) {
                newheight = this.latestitem.getHeight() + (y - (this.latestitem.getY() + this.latestitem.getHeight()));
              } else {
                newheight = this.latestitem.getHeight() - ((this.latestitem.getY() + this.latestitem.getHeight()) - y);
              }
              break;
            }
          }
          
          switch (this.resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_BOTTOM_LEFT:
            case RESIZE_LEFT_CENTER: {
               if (x > this.latestitem.getX()) {
                newwidth = this.latestitem.getWidth() - (x - this.latestitem.getX());
              } else {
                newwidth = this.latestitem.getWidth() + (this.latestitem.getX() - x);                
              }
              break;
            }
          case RESIZE_TOP_RIGHT: 
          case RESIZE_BOTTOM_RIGHT:
          case RESIZE_RIGHT_CENTER: {
            if (x > (this.latestitem.getX() + this.latestitem.getWidth() )) {
              newwidth = this.latestitem.getWidth() + (x -(this.latestitem.getX() + this.latestitem.getWidth()));
            } else {
              newwidth = this.latestitem.getWidth() + (x -(this.latestitem.getX() + this.latestitem.getWidth()));                
            }
            break;  
            }
            
          }
  
          switch (this.resizeEnabled) {
            case RESIZE_TOP_LEFT:{
              newX = x;
              newY = y;
              break;
            }
           case RESIZE_BOTTOM_LEFT: {
            newY = this.latestitem.getY();
            newX = x;
            break;
           }
           case RESIZE_TOP_RIGHT: {
            newY = y;
            newX = this.latestitem.getX();
  
            break;
           }
            case RESIZE_BOTTOM_RIGHT: {
            newY = this.latestitem.getY();
            newX = this.latestitem.getX();
            break;
            }
            case RESIZE_TOP_CENTER: {
             newX = this.latestitem.getX();
             newwidth = this.latestitem.getWidth();
             newY = y;
             break; 
            }
            case RESIZE_BOTTOM_CENTER: {
             newX = this.latestitem.getX();
             newwidth = this.latestitem.getWidth();
             newY = this.latestitem.getY();
             break; 
            }
            case RESIZE_LEFT_CENTER: {
             newY = this.latestitem.getY();
             newheight = this.latestitem.getHeight();
             newX = x;
             break; 
            }
            case RESIZE_RIGHT_CENTER: {
             newY = this.latestitem.getY();
             newheight = this.latestitem.getHeight();
             newX = this.latestitem.getX();           
             break; 
            }
          }
  
          this.latestitem.setWidth(newwidth);
          this.latestitem.setHeight(newheight);
          this.latestitem.setX(newX);
          this.latestitem.setY(newY);        
      } else if (this.latestitem instanceof Kinetic.Line) {
        
      }

        
        this.layer.draw();
      
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
      console.log(popup_menu);
      
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
        case TOOL_MOVE:
          {
            if (this.selectionVisible) {
              var item = canvas_util.selectShape(kinetic_obj.templayer, x, y);
              if (item != null && this.latestitem != null && this.latestitem instanceof Kinetic.Text) {
                this.selectionVisible = false;
                this.templayer.removeChildren();
                this.templayer.draw();
                console.log('resize enabled');
                // Decide how to do resizing, i.e. from which spot user started the resize
                //var Y_Spot =;
                var CONST_TOP_Y = 2;
                var CONST_BOTTOM_Y = 1;
                var CONST_CENTER_Y = 3;
                 function Get_Y_Spot(y) {
                  var retval = 0;
                  if (canvas_util.isBetween(y, kinetic_obj.latestitem.getY() + kinetic_obj.latestitem.getHeight() - CONST_SELECTION_ITEM_SIZE, kinetic_obj.latestitem.getY() + kinetic_obj.latestitem.getHeight() + CONST_SELECTION_ITEM_SIZE) ) {                    
                      retval = CONST_BOTTOM_Y;                  
                  }

                  if (canvas_util.isBetween(y, kinetic_obj.latestitem.getY() - CONST_SELECTION_ITEM_SIZE, kinetic_obj.latestitem.getY() + CONST_SELECTION_ITEM_SIZE) ) {                    
                      retval = CONST_TOP_Y;                  
                  }

                  if (canvas_util.isBetween(y, kinetic_obj.latestitem.getY() + (kinetic_obj.latestitem.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, kinetic_obj.latestitem.getY() + (kinetic_obj.latestitem.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE) ) {                    
                      retval = CONST_CENTER_Y;                  
                  }
                  
                  return retval;
                }
                
                // TODO: There's a more beautiful way of doing this
                if (canvas_util.isBetween(x, this.latestitem.getX() - CONST_SELECTION_ITEM_SIZE, this.latestitem.getX() + CONST_SELECTION_ITEM_SIZE) ) {
                  // Selection is on the left side
                  switch (Get_Y_Spot(y)) {
                    case CONST_BOTTOM_Y: {
                       this.resizeEnabled = RESIZE_BOTTOM_LEFT;
                       break;
                    }
                    case CONST_TOP_Y: {
                       this.resizeEnabled = RESIZE_TOP_LEFT;  
                      break;
                    }
                    case CONST_CENTER_Y: {
                      this.resizeEnabled = RESIZE_LEFT_CENTER;
                      break;
                    }
                  }
                } else if (canvas_util.isBetween(x, this.latestitem.getX() + this.latestitem.getWidth() - CONST_SELECTION_ITEM_SIZE, this.latestitem.getX() + this.latestitem.getWidth() + CONST_SELECTION_ITEM_SIZE)) {
                  // Selection is on the right side
                  switch (Get_Y_Spot(y)) {
                    case CONST_BOTTOM_Y: {
                       this.resizeEnabled = RESIZE_BOTTOM_RIGHT;
                       break;
                    }
                    case CONST_TOP_Y: {
                       this.resizeEnabled = RESIZE_TOP_RIGHT;  
                      break;
                    }
                    case CONST_CENTER_Y: {
                      this.resizeEnabled = RESIZE_RIGHT_CENTER;
                      break;
                    }
                  }
                } else if (canvas_util.isBetween(x, this.latestitem.getX() + (this.latestitem.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, this.latestitem.getX() + (this.latestitem.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE) ) {
                  // Selection is in the middle section
                                    switch (Get_Y_Spot(y)) {
                    case CONST_BOTTOM_Y: {
                       this.resizeEnabled = RESIZE_BOTTOM_CENTER;
                       break;
                    }
                    case CONST_TOP_Y: {
                       this.resizeEnabled = RESIZE_TOP_CENTER;  
                      break;
                    }
                  }
                }
                console.log('resize corner: ' + this.resizeEnabled);
              }
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
        
        case TOOL_DELETE:
          {
            popup_menu.hidePopup(this.popup_menu_layer);
            var itemToDelete = canvas_util.selectShape(this.layer, x, y);
            
            if (itemToDelete != null) {
              this.layer.remove(itemToDelete);
              this.layer.draw();
              itemToDelete = null;
            }
            break;
          }
          
        default:
        {
          popup_menu.hidePopup(this.popup_menu_layer);
          break;
        }
      }
    },
    drawEndHandler: function(event) {
      this.resizeEnabled = 0;
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
      
      if (this.resizeEnabled != 0 && this.latestitem != null) {        
        this.resizeElement(x, y);
      } else {
        if (this.currentTool === TOOL_MOVE) {
              if (!Modernizr.touch) {
                var item = null;
                if (this.latestitem != null && this.latestitem instanceof Kinetic.Text) {
                  console.log(this.latestitem);
                // In case the selection is already displayed, allow user to go outside of the shape for CONST_SELECTION_ITEM_SIZE before hiding the selection  
                  if (canvas_util.isBetween(x, this.latestitem.getX() - CONST_SELECTION_ITEM_SIZE, this.latestitem.getX() + this.latestitem.getWidth() + CONST_SELECTION_ITEM_SIZE) &&
                      canvas_util.isBetween(y, this.latestitem.getY() - CONST_SELECTION_ITEM_SIZE, this.latestitem.getY() + this.latestitem.getHeight() + CONST_SELECTION_ITEM_SIZE)
                      ) {
                    item = this.latestitem;
                  } else {
                    item = null;
                  }
                } else {
                  item = canvas_util.selectShape(this.layer, x, y);                  
                }
              
                kinetic_obj.changeDragDrop(false);
                this.latestitem = item;
                // if the cursor is currently hovering on top
                if (item != null && item instanceof Kinetic.Text) {
                  this.selectionVisible = true;
                  this.templayer.removeChildren();
                  // Top - center
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() + (item.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + (item.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                  // Left - center
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE,item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
                  // Bottom - center
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() + (item.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE + item.getHeight(), item.getX() + (item.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE + item.getHeight());
                  // Right - center
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE + item.getWidth(), item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE + item.getWidth(), item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
      
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() + item.getWidth() - CONST_SELECTION_ITEM_SIZE, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getX() + item.getWidth() + CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE);
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getX() + CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE);
                  this.drawSelectionElement(kinetic_obj.templayer, item.getX() + item.getWidth() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getX() + item.getWidth() + CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE);
                } else if (item != null && item instanceof Kinetic.Line) {
                  this.selectionVisible = true;
                  this.templayer.removeChildren();
                  var points = item.getPoints();
                  
                  for (var i = 0; i < points.length; i++) {
                    this.drawSelectionElement(kinetic_obj.templayer, points[i].x - CONST_SELECTION_ITEM_SIZE, points[i].y - CONST_SELECTION_ITEM_SIZE, points[i].x + CONST_SELECTION_ITEM_SIZE, points[i].y + CONST_SELECTION_ITEM_SIZE);                   
                  }
                } else {
                  this.selectionVisible = false;
                  this.templayer.removeChildren();
                  this.templayer.draw();
                }
              }
              
        }
        
        if (this.drawing === true) {
          draw_end_x = x;
          draw_end_y = y;
          this.templayer.removeChildren();
          this.templayer.draw();
          
          switch (this.currentTool) {
            case TOOL_ARROW:
              {
                this.drawArrowElement(this.templayer, this.draw_start_x, this.draw_start_y, x, y);
                break;
              }
            
            case TOOL_RECT:
              {
                this.drawRectElement(this.templayer, this.draw_start_x, this.draw_start_y, x, y);                    
                break;
              }        
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
      require(['dropbox_handler'], function(dropbox_handler) {
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
          kinetic_obj.latestitem = null;
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
    
    require(['popup_menu'], function(menu) {
      popup_menu = menu.popup_menu;
    });
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