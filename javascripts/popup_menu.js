define (function() {

var CONST_SEPARATOR = '<separator>';

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
  
  return {
    popup_menu: popup_menu
  }
  
});