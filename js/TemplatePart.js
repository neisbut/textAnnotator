goog.provide('tvs.TemplatePart');

/**
 * @constructor
 */
tvs.TemplatePart = function() {

};

/**
 * Applies template part to element
 * @param {Element} element
 * @param {Element} prevElement
 * @param {Object} annotationRect
 * @param {number} partIndex
 * @param {number} partsCount
 * @param {string} color
 * @param {number} starCost
 */
tvs.TemplatePart.prototype.applyToElement = goog.abstractMethod;

/**
 * Element needs to be resized
 * @param {Element} element
 * @param {Object} rect
 */
tvs.TemplatePart.prototype.resizeElement = goog.abstractMethod;
