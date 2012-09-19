require(['dropbox_handler'], function(dropbox_handler) {        
    dropbox_handler.authenticate();
    dropbox_handler.readdir('/', function(error, entries) {
        if (error) {
            return dropbox_handler.error_handler(error);
        }

        for (var i = 0; i < entries.length; i++) {
            $('body').append('<br><a href="drawscreen.html?filename=' + entries[i] + '">' + entries[i]);
        }
        $('#loading').hide();
    });
});
