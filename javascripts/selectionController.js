define (['canvasUtil'], function(canvasUtil) {

    var CONST_SELECTION_ITEM_SIZE = 6;
    var CONST_TOP_Y = 2;
    var CONST_BOTTOM_Y = 1;
    var CONST_CENTER_Y = 3;

    var RESIZE_TOP_LEFT = 1;
    var RESIZE_TOP_CENTER = 2;
    var RESIZE_TOP_RIGHT = 3;
    var RESIZE_LEFT_CENTER = 4;
    var RESIZE_RIGHT_CENTER = 5;
    var RESIZE_BOTTOM_LEFT = 6;
    var RESIZE_BOTTOM_CENTER = 7;
    var RESIZE_BOTTOM_RIGHT = 8;
    
    var resizeEnabled = false; // TRUE user is currently resizing an object, FALSE user is not resizing object currently
    var selectedObject = null; // Kinetic.Shape that is currently being selected / resized
    var selectionVisible = false;

    function handleSelection(layer, templayer, x, y) {
      if (resizeEnabled != 0 && selectedObject != null) {
    //resizeBy
      } else {
        if (!Modernizr.touch) { // This type of selection only allowed for non-touch environments
          var item = null;
          if (selectedObject != null && selectedObject instanceof Kinetic.Text) {
            // In case the selection is already displayed, allow user to go outside of the shape for CONST_SELECTION_ITEM_SIZE before hiding the selection  
            if (canvasUtil.isBetween(x, selectedObject.getX() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + selectedObject.getWidth() + CONST_SELECTION_ITEM_SIZE) &&
                canvasUtil.isBetween(y, selectedObject.getY() - CONST_SELECTION_ITEM_SIZE, selectedObject.getY() + selectedObject.getHeight() + CONST_SELECTION_ITEM_SIZE)
                ) {
              item = selectedObject;
            } else {
              item = null;
            }
          } else {
            item = canvasUtil.selectShape(layer, x, y);                  
          }
        
          //changeDragDrop(false);
          selectedObject = item;
          // if the cursor is currently hovering on top
          if (item != null && item instanceof Kinetic.Text) {
            showRectSelection(templayer, item);
            selectionVisible = true;
          } else if (item != null && item instanceof Kinetic.Line) {
            selectionVisible = true;
            templayer.removeChildren();
            var points = item.getPoints();
            
            for (var i = 0; i < points.length; i++) {
              drawSelectionElement(templayer, points[i].x - CONST_SELECTION_ITEM_SIZE, points[i].y - CONST_SELECTION_ITEM_SIZE, points[i].x + CONST_SELECTION_ITEM_SIZE, points[i].y + CONST_SELECTION_ITEM_SIZE);                   
            }
          } else {
            //selectionVisible = false;
            //templayer.removeChildren();
            //templayer.draw();
          }
        }
      }
    }
    
    function drawSelectionElement(drawtolayer, startx, starty, endx, endy, text) {
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
    }

    /*
     * Parameters:
     *  layer - Kinetic.Layer where to draw the selection
     *  rect - Kinetic.Text / Kinetic.Rect where to draw the selection
     */
    function showRectSelection(layer, rect) {
        selectionVisible = true;
        
        layer.removeChildren();
        // Top - center
        drawSelectionElement(layer, rect.getX() + (rect.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + (rect.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        // Left - center
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() + (rect.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE,rect.getY() + (rect.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
        // Bottom - center
        drawSelectionElement(layer, rect.getX() + (rect.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE + rect.getHeight(), rect.getX() + (rect.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE + rect.getHeight());
        // Right - center
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE + rect.getWidth(), rect.getY() + (rect.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE + rect.getWidth(), rect.getY() + (rect.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);

        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() + rect.getWidth() - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + rect.getWidth() + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() + rect.getWidth() - CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() - CONST_SELECTION_ITEM_SIZE, rect.getX() + rect.getWidth() + CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() + CONST_SELECTION_ITEM_SIZE);
    }
    
    function hideRectSelection(layer) {
        selectionVisible = false;
        layer.removeChildren();
        layer.draw();        
    }

    function Get_Y_Spot(y, item) {
        var retval = 0;
        if (canvasUtil.isBetween(y, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE) ) {                    
            retval = CONST_BOTTOM_Y;                  
        }
        
        if (canvasUtil.isBetween(y, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE) ) {                    
            retval = CONST_TOP_Y;                  
        }
        
        if (canvasUtil.isBetween(y, item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE) ) {                    
            retval = CONST_CENTER_Y;                  
        }
        return retval;
    }

    function getSelectionPoint(templayer, x, y) {
        // Decide how to do resizing, i.e. from which spot user started the resize
        //var Y_Spot =;
        console.log('getSelectionPoint begin');
        var resizeEnabled = 0;
        
        // TODO: There's a more beautiful way of doing this
        if (canvasUtil.isBetween(x, selectedObject.getX() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + CONST_SELECTION_ITEM_SIZE) ) {
          // Selection is on the left side
          switch (Get_Y_Spot(y, selectedObject)) {
            case CONST_BOTTOM_Y: {
               resizeEnabled = RESIZE_BOTTOM_LEFT;
               break;
            }
            case CONST_TOP_Y: {
               resizeEnabled = RESIZE_TOP_LEFT;  
              break;
            }
            case CONST_CENTER_Y: {
              resizeEnabled = RESIZE_LEFT_CENTER;
              break;
            }
          }
        } else if (canvasUtil.isBetween(x, selectedObject.getX() + selectedObject.getWidth() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + selectedObject.getWidth() + CONST_SELECTION_ITEM_SIZE)) {
          // Selection is on the right side
          switch (Get_Y_Spot(y, selectedObject)) {
            case CONST_BOTTOM_Y: {
               resizeEnabled = RESIZE_BOTTOM_RIGHT;
               break;
            }
            case CONST_TOP_Y: {
               resizeEnabled = RESIZE_TOP_RIGHT;  
              break;
            }
            case CONST_CENTER_Y: {
              resizeEnabled = RESIZE_RIGHT_CENTER;
              break;
            }
          }
        } else if (canvasUtil.isBetween(x, selectedObject.getX() + (selectedObject.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + (selectedObject.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE) ) {
          // Selection is in the middle section
            switch (Get_Y_Spot(y, selectedObject)) {
            case CONST_BOTTOM_Y: {
               resizeEnabled = RESIZE_BOTTOM_CENTER;
               break;
            }
            case CONST_TOP_Y: {
               resizeEnabled = RESIZE_TOP_CENTER;  
              break;
            }
          }
        }
        
        return resizeEnabled;
    }
    
    function getSelectionVisible() {
        return selectionVisible;
    }
 

return {
    handleSelection: handleSelection,
    getSelectionVisible: getSelectionVisible,
    getSelectionPoint: getSelectionPoint
}


});