define(function() {

  /*
   * selectShape
   *
   * Returns KineticJS shape object from the given layer, from the given coordinates
   */
  function selectShape(selection_layer, x, y) {
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
  
  function isBetween(number, lower, higher) {
    var retval = false;
    
    if (number >= lower && number <= higher) {
      retval = true;
    }
    
    return retval;
    
  }

  return {
    selectShape: selectShape,
    isBetween: isBetween
  }

});
