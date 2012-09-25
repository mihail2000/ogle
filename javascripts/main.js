require(['dropbox_handler'], function(dropbox_handler) {        
    
    function getDropboxFiles() {
        $('#load').button('disable');
        $('#recentfiles').empty();
        $('#loading').show();
        $('#loading').append('<h3>Fetching contents...</h3>');
        
        dropbox_handler.authenticate();
        dropbox_handler.readdir('/', function(error, entries) {
            if (error) {
                $('#load').button('enable');
                $('#loading').empty();
                $('#loading').hide();
                return dropbox_handler.error_handler(error);
            }
    
            for (var i = 0; i < entries.length; i++) {
                $('#recentfiles').append('<br><a href="drawscreen.html?filename=' + entries[i] + '">' + entries[i]);
            }
        $('#load').button('enable');
        $('#loading').empty();
        $('#loading').hide();

        });

    }
    
    function newDiagram() {
        
    }
    
    function init() {
        $('#new').button();
        $('#load').button();
        $('#load').click(function() {getDropboxFiles()});
        
        $('#new').click(function() {
            $('#errors').empty();
            var width = $('#width').val();
            var height = $('#height').val();
            if (isNaN(parseInt(width)) || isNaN(parseInt(height))) {
                $('#errors').append('Non numeric values in width and/or height');
                $('#errors').show();
            } else if (parseInt(width) > 1400 || parseInt(height) > 1200) {
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
