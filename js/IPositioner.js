goog.provide('tvs.IPositioner');

/**
 * @interface
 */
tvs.IPositioner = goog.nullFunction;

/**
 * [getPosition description]
 * @param {Object} elementRect
 * @param {number} annotationHeight
 * @return {Object}
 */
tvs.IPositioner.prototype.getPosition = goog.abstractMethod;
