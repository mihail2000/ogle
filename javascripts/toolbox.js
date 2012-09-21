/*
 *  toolbox.js
 *
 *  Handles and manages toolbox related features.
 *  Tries to follow MVC pattern as much as possible.
 */
define (function() {
    
    // TOOLBOX_CONSTS: Model of MVC pattern. Defines button captions and their respective ids (id being a unique 'name' for the button).
    // Related IDS and LABELS must be in a same array index in order to things work.
    var TOOLBOX_CONSTS = {
        TOOLBUTTONS_IDS: ['load', 'save', 'select', 'move', 'rect', 'line', 'settext', 'delete', 'color'], 
        TOOLBUTTON_LABELS: ['Load', 'Save', 'Select', 'Move', 'Rect', 'Line', 'Text', 'Delete', 'Color']
    };
    
    var toolbox_obj = {
        selected_tool: '',
        selected_callback: null
    };
    
    /*
     * toolSelection
     *
     * Controller of MVC pattern.
     * If callback function has been set using SetCallBack, calls that function with newly selected tool (to inform tool has changed)
     *
     * Parameters:
     * toolSelected - ID (look TOOLBOX_CONSTS.TOOLBUTTONS_IDS) of the button selected.
     */
    function toolSelection(toolSelected) {
        toolbox_obj.selected_tool = toolSelected.val();
        if (toolbox_obj.selected_callback != null) {
            toolbox_obj.selected_callback(toolbox_obj.selected_tool);            
        }
    }
    
    /*
     * InitializeToolBox
     *
     * Sort of an 'View' in MVC. Creates the view using constants from above and links button clicks with the controller.
     * 
     */
    function InitilizeToolBox() {
        for (var i = 0; i < TOOLBOX_CONSTS.TOOLBUTTONS_IDS.length; i++) {
            $('#radio')
            .append('<input type="radio" id="radio' + (+i + 1) + '" name="radio" value="' + TOOLBOX_CONSTS.TOOLBUTTONS_IDS[i] + '" /><label for="radio' + (+i + 1) + '">' + TOOLBOX_CONSTS.TOOLBUTTON_LABELS[i] + '</label>');
            $('#radio' + (+i + 1)).on("click", function(event){
                toolSelection($(this));
            });          
        }        
        $(function() {
            $("#radio").buttonset();
        });
    }
    
    /*
     * SetCallBack
     *
     * Sets the callback function for button clicks.
     * 
     * Parameters:
     * refSelectedTool - Callback function. Must have a prototype of function(toolID). 
     */
    function SetCallBack(refSelectedTool) {
        toolbox_obj.selected_callback = refSelectedTool;
    }
    
    InitilizeToolBox();
    
    // Self-evident object exposed out of the module.
    return {
    init: InitilizeToolBox,
    selecteditem: toolbox_obj.selected_tool,
    setcallback: SetCallBack
    }
});