 /*
   * shape_to_XML
   *
   * This class creates XML from given Kinetic shapes.
   * This XML can be used to save diagrams as XML files.
  */
function shapeToXML() {
    
    var that = this;
    
    /*
     * convertToXML (public)
     *
     * Converts given KineticJS shapes to XML and returns the XML string.
     *
     * Parameters:
     * shapearray - array of KineticJS shapes to be converted
     *
     * Returns:
     * String containing the generated XML
     */
    this.convertToXML = function(shapeArray) {
      var xmlString = getHeaderXML();
      
      for (var i = 0; i < shapeArray.length; i++)
      {
        var shape = shapeArray[i];      
        xmlString += convertShapeToXML(shape);
      }
      xmlString += getFooterXML();
      return xmlString;
    
      /*
       * convertShapeToXml (private)
       *
       * Converts given shape (1st paramerter) to XML string and returns it.
       * Returned XML can be used to save the given shape to a sfile.
       */
      function convertShapeToXML(shape) {
        var xmlString = '';
          var type = '';
          var CONST_TYPE_RECT = 'RECT';
          var CONST_TYPE_ARROW = 'ARROW';
    
          xmlString += '\t<shape ';
    
          if (shape instanceof Kinetic.Text) {
            type = CONST_TYPE_RECT;
            console.log('This is rect');
            xmlString += 'type="rect"';
          } else if (shape instanceof Kinetic.Line)
          {
            type = CONST_TYPE_ARROW;
            xmlString += 'type="arrow"';
            console.log('This is line');
          }
          
          switch (type)
          {
            case CONST_TYPE_RECT:
              {
                xmlString += xmlFromProperty(shape, 'getX', 'x')
                xmlString += xmlFromProperty(shape, 'getY', 'y')
                xmlString += xmlFromProperty(shape, 'getZIndex', 'zindex')
                xmlString += xmlFromProperty(shape, 'getHeight', 'height')
                xmlString += xmlFromProperty(shape, 'getWidth', 'width')
                xmlString += xmlFromProperty(shape, 'getCornerRadius', 'cornerradius')
                xmlString += xmlFromProperty(shape, 'getFill', 'fill')
                xmlString += '>';
                break;
              }
              
            case CONST_TYPE_ARROW:
              {
                var points = shape.getPoints();
                  xmlString += xmlFromProperty(shape, 'getZIndex', 'zindex')
                  xmlString += '>\n\t\t<coords>\n';
                  
                for (var i = 0; i < points.length; i++)
                {
                  xmlString += '\t\t\t<coord x="';  
                  xmlString += points[i].x;
                  xmlString += '" ';  
                  xmlString += 'y="';  
                  xmlString += points[i].y;
                  xmlString += '"</coord>\n';  
                }
                xmlString += '\t\t</coords>\n\t';
                break;
              }
          }
  
          if (type === CONST_TYPE_RECT) {
            var txt = shape.getText();
            txt = txt.replace(/(^\s+|\s+$)/g,' ');
            if (txt != '') {
              xmlString += txt;
            }        
          }
          xmlString += '</shape>\n';
        return xmlString;
      };
      
      /*
       * xmlFromProperty (private)
       *
       * Parameters:
       * obj - reference to the object (i.e. KineticJS shape type of object)
       * obj_property - name of the method to be called to retrieve the value from the given object
       * XMLAttribute - attribute name where to store the value from the given object
       *
       * Returns:
       * XML attribute with a given name and a value from the given object, using the given method.
       */
      function xmlFromProperty(obj, obj_method, XMLAttribute, obj_property) {
        var str = ' ' + XMLAttribute;
        str += '="';
        if (obj_property === false || obj_property == undefined) {
          str += obj[obj_method]();      
        } else {
          str =+ obj[obj_property];
        }
        str += '"';
        return str;  
      };
      
      /*
       * getHeaderXML (private)
       *
       * Helper function returning XML header
       *
       * Returns:
       * String containing XML header
       */
      function getHeaderXML() {
        var str = '<?xml version="1.0" encoding="utf-8"?>\n<shapes>\n';
        return str;
      };
      
      /*
       * getFooterXML
       *
       * Helper function returning the XML footer
       *
       * Returns:
       * String containing XML footer
       */
      function getFooterXML() {
        var str = '</shapes>';
        return str;
      };
    };  
};
