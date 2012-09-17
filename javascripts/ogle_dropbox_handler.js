// Drop box handler
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
  
  function loadcontents(filename) {
    var status = dropbox_data.client.readFile('jsmapper_1.xml', function(error, data){
      if (error) {
        return dropbox_data.DropBoxError(error);
      } else {
        dropbox_data.file_data = data;
        console.log(data);
      }
      
    });    
  }
  
  function readdir(callback) {
    //dropbox_data.client.readdir("/", function(error, entries) {
    dropbox_data.client.readdir("/", callback);
    /*
    {
      if (error) {
        return dropbox_data.DropBoxError(error);  
      }
      
      //return entries;
      alert("Your Dropbox contains " + entries.join(", "));
    });
    */
  }
  
  
  return {
    authenticate: authenticate,
    loadcontents: loadcontents,
    readdir: readdir,
    error_handler: dropbox_data.DropBoxError,
    filedata: dropbox_data.file_data
  }
  
});
