define(['canvasUtil'], function (canvasUtil) {
    'use strict';
    var CONST_SELECTION_ITEM_SIZE = 6,
        CONST_TOP_Y = 2,
        CONST_BOTTOM_Y = 1,
        CONST_CENTER_Y = 3,
        RESIZE_TOP_LEFT = 1,
        RESIZE_TOP_CENTER = 2,
        RESIZE_TOP_RIGHT = 3,
        RESIZE_LEFT_CENTER = 4,
        RESIZE_RIGHT_CENTER = 5,
        RESIZE_BOTTOM_LEFT = 6,
        RESIZE_BOTTOM_CENTER = 7,
        RESIZE_BOTTOM_RIGHT = 8,
        resizeEnabled = 0, // != 0 user is currently resizing an object. Value defines the corner where resizing takes place. 0 = user is not resizing object currently
        selectedObject = null, // Kinetic.Shape that is currently being selected / resized
        selectionVisible = false,
        id = 'move'; //TODO: use constants. Somehow...
    function resizeElement(layer, item, x, y) {
        console.log('resizeElement begins');
        var newheight = 0,
            newwidth = 0,
            newX = 0,
            newY = 0,
            i = 0,
            points = null,
            newPoints = [];
        if (item instanceof Kinetic.Text) {
            switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_TOP_RIGHT:
            case RESIZE_TOP_CENTER:
                if (y > item.getY()) {
                    newheight = item.getHeight() - (y - item.getY());
                } else {
                    newheight = item.getHeight() + (item.getY() - y);
                }
                break;
            case RESIZE_BOTTOM_LEFT:
            case RESIZE_BOTTOM_RIGHT:
            case RESIZE_BOTTOM_CENTER:
                if (y > (item.getY() + item.getHeight())) {
                    newheight = item.getHeight() + (y - (item.getY() + item.getHeight()));
                } else {
                    newheight = item.getHeight() - ((item.getY() + item.getHeight()) - y);
                }
                break;
            }
            switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:
            case RESIZE_BOTTOM_LEFT:
            case RESIZE_LEFT_CENTER:
                if (x > item.getX()) {
                    newwidth = item.getWidth() - (x - item.getX());
                } else {
                    newwidth = item.getWidth() + (item.getX() - x);
                }
                break;
            case RESIZE_TOP_RIGHT:
            case RESIZE_BOTTOM_RIGHT:
            case RESIZE_RIGHT_CENTER:
                if (x > (item.getX() + item.getWidth())) {
                    newwidth = item.getWidth() + (x - (item.getX() + item.getWidth()));
                } else {
                    newwidth = item.getWidth() + (x - (item.getX() + item.getWidth()));
                }
                break;
            }
            switch (resizeEnabled) {
            case RESIZE_TOP_LEFT:
                newX = x;
                newY = y;
                break;
            case RESIZE_BOTTOM_LEFT:
                newY = item.getY();
                newX = x;
                break;
            case RESIZE_TOP_RIGHT:
                newY = y;
                newX = item.getX();
                break;
            case RESIZE_BOTTOM_RIGHT:
                newY = item.getY();
                newX = item.getX();
                break;
            case RESIZE_TOP_CENTER:
                newX = item.getX();
                newwidth = item.getWidth();
                newY = y;
                break;
            case RESIZE_BOTTOM_CENTER:
                newX = item.getX();
                newwidth = item.getWidth();
                newY = item.getY();
                break;
            case RESIZE_LEFT_CENTER:
                newY = item.getY();
                newheight = item.getHeight();
                newX = x;
                break;
            case RESIZE_RIGHT_CENTER:
                newY = item.getY();
                newheight = item.getHeight();
                newX = item.getX();
                break;
            }
            item.setWidth(newwidth);
            item.setHeight(newheight);
            item.setX(newX);
            item.setY(newY);
        } else if (item instanceof Kinetic.Line) {
            points = item.getPoints();
            for (i = 0; i < points.length; i += 1) {
                newPoints.push(points[i]);
                if (i === resizeEnabled) {
                    newPoints.x = x;
                    newPoints.y = y;
                }
            }
            item.setPoints(newPoints);
        }
        layer.draw();
    }
    function drawSelectionElement(drawtolayer, startx, starty, endx, endy) {
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
        rect = new Kinetic.Rect({
            x: rectx,
            y: recty,
            width: rectwidth,
            height: rectheight,
            fill: '#ffffff',
            stroke: 'black',
            textFill: '#555',
            strokeWidth: 1,
            cornerRadius: 0,
            padding: 0
        });
        drawtolayer.add(rect);
        drawtolayer.draw();
    }
    /*
     * Parameters:
     *  layer - Kinetic.Layer where to draw the selection
     *  rect - Kinetic.Text / Kinetic.Rect where to draw the selection
     */
    function showRectSelection(layer, rect) {
        selectionVisible = true;
        layer.removeChildren();
        // Top - center
        drawSelectionElement(layer, rect.getX() + (rect.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + (rect.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        // Left - center
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() + (rect.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE, rect.getY() + (rect.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
        // Bottom - center
        drawSelectionElement(layer, rect.getX() + (rect.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE + rect.getHeight(), rect.getX() + (rect.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE + rect.getHeight());
        // Right - center
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE + rect.getWidth(), rect.getY() + (rect.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE + rect.getWidth(), rect.getY() + (rect.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() + rect.getWidth() - CONST_SELECTION_ITEM_SIZE, rect.getY() - CONST_SELECTION_ITEM_SIZE, rect.getX() + rect.getWidth() + CONST_SELECTION_ITEM_SIZE, rect.getY() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() - CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() - CONST_SELECTION_ITEM_SIZE, rect.getX() + CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() + CONST_SELECTION_ITEM_SIZE);
        drawSelectionElement(layer, rect.getX() + rect.getWidth() - CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() - CONST_SELECTION_ITEM_SIZE, rect.getX() + rect.getWidth() + CONST_SELECTION_ITEM_SIZE, rect.getY() + rect.getHeight() + CONST_SELECTION_ITEM_SIZE);
    }
    function hideRectSelection(layer) {
        selectionVisible = false;
        layer.removeChildren();
        layer.draw();
    }
    function getYSpot(y, item) {
        var retval = 0;
        if (canvasUtil.isBetween(y, item.getY() + item.getHeight() - CONST_SELECTION_ITEM_SIZE, item.getY() + item.getHeight() + CONST_SELECTION_ITEM_SIZE)) {
            retval = CONST_BOTTOM_Y;
        }
        if (canvasUtil.isBetween(y, item.getY() - CONST_SELECTION_ITEM_SIZE, item.getY() + CONST_SELECTION_ITEM_SIZE)) {
            retval = CONST_TOP_Y;
        }
        if (canvasUtil.isBetween(y, item.getY() + (item.getHeight() / 2) - CONST_SELECTION_ITEM_SIZE, item.getY() + (item.getHeight() / 2) + CONST_SELECTION_ITEM_SIZE)) {
            retval = CONST_CENTER_Y;
        }
        return retval;
    }
    function getSelectionPoint(x, y) {
        // Decide how to do resizing, i.e. from which spot user started the resize
        var resizeEnabled = 0;
        // TODO: There's a more beautiful way of doing this
        if (canvasUtil.isBetween(x, selectedObject.getX() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + CONST_SELECTION_ITEM_SIZE)) {
          // Selection is on the left side
            switch (getYSpot(y, selectedObject)) {
            case CONST_BOTTOM_Y:
                resizeEnabled = RESIZE_BOTTOM_LEFT;
                break;
            case CONST_TOP_Y:
                resizeEnabled = RESIZE_TOP_LEFT;
                break;
            case CONST_CENTER_Y:
                resizeEnabled = RESIZE_LEFT_CENTER;
                break;
            }
        } else if (canvasUtil.isBetween(x, selectedObject.getX() + selectedObject.getWidth() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + selectedObject.getWidth() + CONST_SELECTION_ITEM_SIZE)) {
          // Selection is on the right side
            switch (getYSpot(y, selectedObject)) {
            case CONST_BOTTOM_Y:
                resizeEnabled = RESIZE_BOTTOM_RIGHT;
                break;
            case CONST_TOP_Y:
                resizeEnabled = RESIZE_TOP_RIGHT;
                break;
            case CONST_CENTER_Y:
                resizeEnabled = RESIZE_RIGHT_CENTER;
                break;
            }
        } else if (canvasUtil.isBetween(x, selectedObject.getX() + (selectedObject.getWidth() / 2) - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + (selectedObject.getWidth() / 2) + CONST_SELECTION_ITEM_SIZE)) {
          // Selection is in the middle section
            switch (getYSpot(y, selectedObject)) {
            case CONST_BOTTOM_Y:
                resizeEnabled = RESIZE_BOTTOM_CENTER;
                break;
            case CONST_TOP_Y:
                resizeEnabled = RESIZE_TOP_CENTER;
                break;
            }
        }
        return resizeEnabled;
    }
/// New stuff
    function moveEvent(layer, templayer, x, y) {
        console.log('selectionController::moveEvent begin');
        var item = canvasUtil.selectShape(layer, x, y),
            i = 0,
            points = null;
        if (resizeEnabled !== 0 && selectedObject !== null) {
            resizeElement(layer, selectedObject, x, y);
        } else {
            if (!Modernizr.touch) { // This type of selection only allowed for non-touch environments
                item = null;
                if (item === null && selectedObject instanceof Kinetic.Text) {
                  // In case the selection is already displayed, allow user to go outside of the shape for CONST_SELECTION_ITEM_SIZE before hiding the selection  
                    if (canvasUtil.isBetween(x, selectedObject.getX() - CONST_SELECTION_ITEM_SIZE, selectedObject.getX() + selectedObject.getWidth() + CONST_SELECTION_ITEM_SIZE) && canvasUtil.isBetween(y, selectedObject.getY() - CONST_SELECTION_ITEM_SIZE, selectedObject.getY() + selectedObject.getHeight() + CONST_SELECTION_ITEM_SIZE)) {
                        item = selectedObject;
                    } else {
                        item = null;
                    }
                } else {
                    item = canvasUtil.selectShape(layer, x, y);
                }
                selectedObject = item;
                // if the cursor is currently hovering on top
                if (selectedObject !== null && selectedObject instanceof Kinetic.Text) {
                    showRectSelection(templayer, item);
                    selectionVisible = true;
                } else if (item !== null && item instanceof Kinetic.Line) {
                    selectionVisible = true;
                    templayer.removeChildren();
                    points = item.getPoints();
                    for (i = 0; i < points.length; i += 1) {
                        drawSelectionElement(templayer, points[i].x - CONST_SELECTION_ITEM_SIZE, points[i].y - CONST_SELECTION_ITEM_SIZE, points[i].x + CONST_SELECTION_ITEM_SIZE, points[i].y + CONST_SELECTION_ITEM_SIZE);
                    }
                } else {
                    selectionVisible = false;
                    templayer.removeChildren();
                    templayer.draw();
                }
            }
        }
    }
    function startEvent(layer, templayer, x, y) {
        var item = null; // Reference to Kinetic.Shape
        console.log('selectionController::startEvent');
        if (selectionVisible) {
            resizeEnabled = getSelectionPoint(x, y);
            item = canvasUtil.selectShape(templayer, x, y);
            if (item !== null && selectedObject !== null && selectedObject instanceof Kinetic.Text) {
                hideRectSelection(templayer);
                console.log('resize enabled');
                console.log('resize corner: ' + resizeEnabled);
            } else {
                console.log('resize disabled');
            }
        }
    }
    function endEvent(layer, templayer, x, y) {
        console.log('selectionController::endEvent');
        selectionVisible = false;
        resizeEnabled = 0;
        selectedObject = null;
    }
    function getId() {
        return id;
    }
    return {
        startEvent: startEvent,
        moveEvent: moveEvent,
        endEvent: endEvent,
        keyDownEvent: null,
        getId: getId,
        showRectSelection: showRectSelection
    };
});
