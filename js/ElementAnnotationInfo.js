goog.provide('tvs.ElementAnnoationInfo');

/**
 * @constructor
 * @param {Element} el
 * @param {string} propName
 * @param {string} type
 * @param {string} color
 */
tvs.ElementAnnoationInfo = function(el, propName, type, color) {
    this.type = type;
    this.color = color;
    this.elPropName = propName;
    this.annotationElements = [];
    this.annotetedElement = el;
    el[propName] = this;
};

/**
 * Removes annotation from element
 * @export
 */
tvs.ElementAnnoationInfo.prototype.remove = function() {
    goog.array.forEach(this.annotationElements, goog.dom.removeNode);
    delete this.annotetedElement[this.elPropName];
    this.annotetedElement = null;
};
