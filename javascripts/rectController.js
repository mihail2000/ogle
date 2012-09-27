/*
 * rectController.js
 *
 * This module handles rectangle drawing on canvas
 */
/*jslint plusplus: true*/
/*global define, $, Kinetic, console, Modernizr*/
define(function () {
    'use strict';
    var CONST_ID = 'rect',
        drawing = false,
        draw_start_x = 0,
        draw_start_y = 0,
        draw_end_x = 0,
        draw_end_y = 0;
    function drawRectElement(drawtolayer, startx, starty, endx, endy, text, fill) {
        var rectx = 0,
            recty = 0,
            rectheight = 0,
            rectwidth = 0,
            rect = null;
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
        rect = new Kinetic.Text({
            x: rectx,
            y: recty,
            width: rectwidth,
            height: rectheight,
            fill: fill,
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
        if (text !== '') {
            rect.setText(text);
        }
        // add the shape to the layer
        drawtolayer.add(rect);
        drawtolayer.draw();
        return rect;
    }
    function startEvent(layer, templayer, x, y) {
        drawing = true;
        draw_start_x = x;
        draw_start_y = y;
    }
    function moveEvent(layer, templayer, x, y) {
        if (drawing) {
            draw_end_x = x;
            draw_end_y = y;
            templayer.removeChildren();
            templayer.draw();
            drawRectElement(templayer, draw_start_x, draw_start_y, x, y, '', '#aaaaaa');
        }
    }
    function endEvent(layer, templayer, x, y) {
        templayer.removeChildren();
        templayer.draw();
        drawing = false;
        drawRectElement(layer, draw_start_x, draw_start_y, draw_end_x, draw_end_y, '', '#aaaaaa');
    }
    function getId() {
        return CONST_ID;
    }
    return {
        drawRectElement: drawRectElement,
        startEvent: startEvent,
        moveEvent: moveEvent,
        endEvent: endEvent,
        keyDownEvent: null,
        getId: getId
    };
});
