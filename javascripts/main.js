/*jslint plusplus: true*/
/*global window, require, define, $, Kinetic, console, Modernizr, document, location*/
require(['dropbox_handler'], function (dropbox_handler) {
    'use strict';
    function getDropboxFiles() {
        $('#load').button('disable');
        $('#recentfiles').empty();
        $('#loading').show();
        $('#loading').append('<h3>Fetching contents...</h3>');
        dropbox_handler.authenticate();
        dropbox_handler.readdir('/', function (error, entries) {
            var i = 0;
            if (error) {
                $('#load').button('enable');
                $('#loading').empty();
                $('#loading').hide();
                return dropbox_handler.error_handler(error);
            }
            for (i = 0; i < entries.length; i++) {
                $('#recentfiles').append('<br><a href="drawscreen.html?filename=' + entries[i] + '">' + entries[i]);
            }
            $('#load').button('enable');
            $('#loading').empty();
            $('#loading').hide();
        });
    }
    function init() {
        $('#new').button();
        $('#load').button();
        $('#load').click(function () {
            getDropboxFiles();
        });
        $('#new').click(function () {
            var width = $('#width').val(),
                height = $('#height').val();
            $('#errors').empty();
            if (isNaN(parseInt(width, 10)) || isNaN(parseInt(height, 10))) {
                $('#errors').append('Non numeric values in width and/or height');
                $('#errors').show();
            } else if (parseInt(width, 10) > 1400 || parseInt(height, 10) > 1200) {
                $('#errors').append('Max value for width = 1400 and height = 1200');
                $('#errors').show();
            } else {
                location.href = 'drawscreen.html?newdiagram=true&width=' + width + '&height=' + height;
            }
            return false;
        });
    }
    init();
});
