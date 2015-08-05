var rangy;


/**
 * Inits rangy
 */
rangy.prototype.init = function() {};

/**
 * @constructor
 */
var range = function() {};

/**
 * returns nodes in range
 * @return {Array}
 */
range.prototype.getNodes = function() {};

/**
 * @constructor
 */
var selection = function() {};

/**
 * return all ranges
 * @return {Array.<range>}
 */
selection.prototype.getAllRanges = function() {};

/**
 * returns selection
 * @return {selection}
 */
rangy.prototype.getSelection = function () {};

/**
 * @constructor
 */
var classApplier = function() {};

/**
 * applies class to selection
 */
classApplier.prototype.applyToSelection = function () {};

/**
 * returns self or ancestor with class
 * @return {?Element}
 */
classApplier.prototype.getSelfOrAncestorWithClass = function () {};

/**
 * Removes this CssClassApplier's CSS class from all text within the specified Rangy range.
 */
classApplier.prototype.undoToRange = function () {};

/**
 * creates class applier
 * @return {classApplier}
 */
rangy.prototype.createClassApplier = function () {};
