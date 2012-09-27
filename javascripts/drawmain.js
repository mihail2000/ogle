/*jslint plusplus: true*/
/*global window, require, define, $, Kinetic, console, Modernizr, URI, document*/
require.config({urlArgs: 'bust=' + (new Date()).getTime()});
/*
 *  Entry point for draw screen 
 */
window.onload = function () {
    'use strict';
    require(['toolbox', 'canvas_handler', 'dropbox_handler', 'fileNameBar', 'javascripts/lib/URI.js'], function (toolbox, canvas_handler, dropbox_handler, fileNameBar) {
        // Check if filename was given as a parameter and give file handler the file name.
        var qs = URI(document.URL).query(true),
            fileparameter = qs.filename,
            width = qs.width,
            height = qs.height;
        if (width === undefined || height === undefined) {
            width = 800;
            height = 600;
        }
        fileNameBar.init(fileparameter);
        toolbox.setcallback(canvas_handler.toolboxcallback);
        canvas_handler.init(width, height);
        if (fileparameter !== undefined) {
            dropbox_handler.authenticate();
            dropbox_handler.loadcontents(fileparameter, canvas_handler.loadfilecallback);
        } else {
            canvas_handler.initEmptyCanvas();
        }
    });
    var elem = document.getElementById('container');
    if (document.getElementById && (elem)) {
        if (elem.style) {
            elem.style.cursor = 'crosshair';
        }
    }
};
