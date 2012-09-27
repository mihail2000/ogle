/*
 * canvasUtil
 *
 * Commonly used canvas utility functions
 */
/*jslint plusplus: true*/
/*global define, $, Kinetic, console, Modernizr*/
define(function () {
    'use strict';
    /*
     * selectShape (public)
     *
     * Returns KineticJS shape object from the given layer, from the given coordinates
     *
     * Parameters:
     *  selection_layer: Kinetic.Layer where to select Kinetic.Shape
     *  x: x coordinate on selection_layer
     *  y: y coordinate on selection_layer
     *
     * Returns:
     *  Kinetic.Shape if there is a shape in given coordinates, otherwise null.
     */
    function selectShape(selection_layer, x, y) {
        var shape = null, // Select the item user clicked
            point = [x, y],
            shapes = selection_layer.getIntersections(point),
            i = 0,
            newshape = null;
        if (shapes.length > 0) {
            shape = shapes[0];
        }
        for (i = 0; i < shapes.length; i++) {
            newshape = shapes[i];
            if (shape.getZIndex() < newshape.getZIndex()) {
                shape = shapes[i];
            }
        }
        return shape;
    }
    /*
     * isBetween (public)
     *
     * Helper function to check if given number is between two other numbers.
     * 'Between' in this case is true, even if the number to be checked is exactly one of the numbers to be checked.
     *
     * Parameters:
     *  number: number to be checked
     *  lower: lower point of the range
     *  higher: higher point of the range
     *
     * Returns:
     *  TRUE = 'number' is between 'lower' and 'higher'. FALSE = it's not.
     */
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
    };
});
