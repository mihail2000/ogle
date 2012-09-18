/*
 * Dropbox handler
 *
 * This module is used to store and retrieve data to Dropbox.
 * Module itself does not know anything about the data structure / format, but is only used to store and retrieve data to/from Dropbox.
 */
define (['dropbox'], function() {
  
  var dropbox_data = {
    client: null,
    authenticated: false,
    file_data: '',  
  /*
   * DropBoxError
   * DropBox error handling function
   */
    DropBoxError: function(error) {
        if (window.console) {  // Skip the "if" in node.js code.
          console.error(error);
        }
      
        switch (error.status) {
  
        case 401:
          // If you're using dropbox.js, the only cause behind this error is that
          // the user token expired.
          // Get the user through the authentication flow again.
          break;
      
        case 404:
          // The file or folder you tried to access is not in the user's Dropbox.
          // Handling this error is specific to your application.
          break;
      
        case 507:
          // The user is over their Dropbox quota.
          // Tell them their Dropbox is full. Refreshing the page won't help.
          break;
      
        case 503:
          // Too many API requests. Tell the user to try again later.
          // Long-term, optimize your code to use fewer API calls.
          break;
      
        case 400:  // Bad input parameter
        case 403:  // Bad OAuth request.
        case 405:  // Request method not expected
        default:
          // Caused by a bug in dropbox.js, in your application, or in Dropbox.
          // Tell the user an error occurred, ask them to refresh the page.
        }    
    }
  };
  
  /*
   * Authenticate establishes the connection to DropBox
   */ 
  function authenticate() {
      dropbox_data.client = new Dropbox.Client({key: "WmTncw0VfBA=|nluPVTIPvryWoLLtlDSK1bTt8jZHOXIAfjhUZUVJGg==", sandbox: true});
      dropbox_data.client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: 'true'}));
      dropbox_data.client.authenticate(function(error, client) {
        if (error) {
          return dropbox_data.DropBoxError(error);
          alert('error ' + error);
        }
      });
      
      dropbox_data.authenticated = true;
      return true;
  }
  
  /*
   * SaveContents
   */
  function SaveContents(filename, data, callback) {
    dropbox_data.client.writeFile(filename, data, callback);
  }
  
  /*
   * LoadContents
   *
   * Loads given file from the Dropbox.
   * Actual loading happens asynchronously - second parameter is a callback function, which will be called when call has been completed.
   *
   * Parameters:
   * filename - path & filename to retrieve from Dropbox.
   * callback - callback function to be called when ready. Function prototype: function(error, data). File contents will be passed as 'data' parameter to callback function.
   *
   * Returns:
   * TRUE if the function succeed, otherwise FALSE.
   */
  function LoadContents(filename, callback) {
    var status = false;
    if (callback != null && callback != 'undefined') {
      var status = dropbox_data.client.readFile(filename, callback);
    }
    return status;
  }
  
  /*
   * readdir
   *
   * Reads contents of the given directory from the Dropbox and returns its contents using the given callback function.
   * Note: root level directory is the folder in Dropbox, which is reserved for this application (not the actual Dropbox root).
   *
   * Parameters:
   * dirname - directory name, which contents will be retrieved.
   * callback - callback function to be called when ready. Function prototype: function(error, data). Directory contents will be passed as an array to 'data' parameter.
   */
  function readdir(dirname, callback) {
    dropbox_data.client.readdir(dirname, callback);
  }
    
  return {
    authenticate: authenticate,
    loadcontents: LoadContents,
    savecontents: SaveContents,
    readdir: readdir,
    error_handler: dropbox_data.DropBoxError,
    filedata: dropbox_data.file_data
  }
  
});
