goog.provide('tvs.ElementAnnotationInfo');

/**
 * @constructor
 * @param {Element} el Current element (one of elements)
 * @param {Array.<Element>} elements All elements which
 *   were annotated simultaneously
 * @param {string} propName
 * @param {string} type
 * @param {string} color
 */
tvs.ElementAnnotationInfo = function(el, elements, propName, type, color) {
    this.type = type;
    this.color = color;
    this.elPropName = propName;
    this.annotationElements = [];
    this.annotatedElement = el;
    this.annotatedElements = elements;
    el[propName] = this;
};

/**
 * Removes annotation from element
 * @export
 */
tvs.ElementAnnotationInfo.prototype.remove = function() {
    goog.array.forEach(this.annotationElements, goog.dom.removeNode);
    delete this.annotatedElement[this.elPropName];
    this.annotatedElement = null;
    this.annotatedElements = null;
};
