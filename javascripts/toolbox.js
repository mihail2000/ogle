define (function() {
    
    var toolbox_obj = {
        selected_tool: ''
    };
    
    function toolSelection(toolSelected) {
        toolbox_obj.selected_tool = toolSelected;
    }
    
    function InitilizeToolBox() {
        
        $("body")
        .append('<div id="radio"><table id="buttontable" border="0" width="800"><tr>');
        var toolbutton_ids = ['select', 'move', 'rect', 'arrow', 'settext', 'delete', 'load', 'save'];
        var toolbutton_labels = ['Select', 'Move', 'Rect', 'Arrow', 'Text', 'Delete', 'Load', 'Save'];
        for (var i = 0; i < toolbutton_ids.length; i++) {
            console.log(toolbutton_labels[i]);
            $('#buttontable')
            .append('<th width="50"><input type="radio" id="radio' + (+i + 1) + '" name="radio" value="' + toolbutton_ids[i] + '" /><label for="radio' + (+i + 1) + '">' + toolbutton_labels[i] + '</label></th>');
            
            $('#radio' + (+i + 1)).on("click", function(event){
                toolSelection($(this));
            });          
        }
        $("body")
        .append('</tr></table></div><p></p><div id="container"></div>');
        
        $(function() {
            $( "#radio" ).buttonset();
        });
        
    }
    
    return {
    init: InitilizeToolBox,
    selecteditem: toolbox_obj.selected_tool
  }
    
    
});