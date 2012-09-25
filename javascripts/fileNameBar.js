/*
 * FileNameBar
 *
 * Handles the filename bar (topmost section of the page).
 * Displays the current filename and provide methods to change the filename.
 */
define (function() {

    var CONST_UNTITLED_FILE = 'Untitled';
    var CONST_FILE_EXTENSION = '.json';
    var _originalFileName = ''; // We should save the original filename, so we know what file to delete when user changes the name.
    var _fileName = '';
    
    /*
     * init
     *
     * Used 
     */
    function init(fileName) {
        var sFileName = fileName;
        _originalFileName = fileName;
        if (sFileName == '') {
            sFileName = CONST_UNTITLED_FILE;
        }
        _fileName = sFileName;        
        displayFileName();
        
        $('#filename').click(function() {
            var newFileName = prompt('Please enter filename', getFileNameWOExtension(_fileName));
            if (newFileName != null && newFileName != ''){
                _fileName = newFileName + CONST_FILE_EXTENSION;
                displayFileName();
              }    
        });
    }
    
    function getFileName() {
        return _fileName;
    }
    
    function getOldFileName() {
        return _originalFileName;
    }
    
    function getFileNameWOExtension(fileName) {
        var idx = fileName.search(CONST_FILE_EXTENSION);
        var displayFileName = ''
        if (idx == -1) {
            displayFileName = fileName;
        } else {
            displayFileName = fileName.substring(0, idx);
        }
        
        return displayFileName;
        
    }
    
    function displayFileName() {
        $('#filename').html(getFileNameWOExtension(_fileName));        
    }
   
    return {
        init: init,
        getFileName: getFileName,
        getOldFileName: getOldFileName
    }

});
