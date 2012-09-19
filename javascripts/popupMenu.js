define (['canvasUtil'], function(canvasUtil) {
  var CONST_SEPARATOR = '<separator>';

  var items = ['Cut', 'Copy', 'Paste', CONST_SEPARATOR, 'Edit shape', 'Edit text', 'Delete'];
  var visible = false;
  var popupMenuLayer = null;
  var selectedCallBack = null;
  
    /*
  function selectMenuAction(menuLayer, x, y) {
      if (selected_shape != null) {
        var selecteditem = canvasUtil.selectShape(menuLayer, x, y);
        hidePopup(menuLayer);
        // TODO: Separate handling of menu items from displaying menu items (MVC)
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
    }
    */
    
    function selectionListener(x, y) {
      if (popupMenuLayer != null) {
        var selectedItem = canvasUtil.selectShape(popupMenuLayer, x, y);        
        if (selectedItem != null && selectedCallBack != null) {
          selectedCallBack(selectedItem.getId()); 
        }
      }
    }
    
    function hidePopup(menuLayer) {
        menuLayer.removeChildren();
        menuLayer.draw();
        visible = false;
    }

    /*
     * showPopup
     *
     * Displays popup menu on given canvas coordinates.
     * Popup is used to manipulate selected objects (edit text, delete etc.)
     *
     * Parameters:
     *  menuLayer - KineticJS layer where the popup will be drawn
     *  x - Top left X coordinate where to draw the menu 
     *  y - Top left Y coordinate -"-
     *  callBack - Callback function which will be called when an item is selected from the popup.
     *            Callback must have the following prototype function(menuID)
     */         
    function showPopup(menuLayer, x, y, callBack) {
        if (visible) {
          hidePopup(menuLayer);
        }
        
        visible = true;
        var y_index = 0;
        selectedCallBack = callBack;
        popupMenuLayer = menuLayer;
        
        for (var i = 0; i < items.length; i++) {
          var rect = null;
          
          if (items[i] != CONST_SEPARATOR) {
            rect = new Kinetic.Text({
            x: x,
            y: y + y_index,
            id: items[i],
            width: 100,
            height: 20,
            text: items[i],
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
            menuLayer.add(rect);
        }
        menuLayer.draw();
      }

  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
    selectionListener: selectionListener,
    visible: visible
  }
  
});