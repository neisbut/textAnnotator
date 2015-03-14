goog.provide('tvs.Template');

goog.require('tvs.ImageTemplatePart');


/**
 * @constructor
 * @export
 * @param {string|tvs.TemplatePart|Array.<tvs.TemplatePart>} parts
 */
tvs.Template = function(parts) {

    this.templateParts_ = goog.isString(parts) ?
        [new tvs.ImageTemplatePart(parts, '*', 'repeat')] :
        (goog.isArray(parts) ? parts : [parts]);

};

/**
 * Returns template parts
 * @return {Array.<tvs.TemplatePart>}
 */
tvs.Template.prototype.getParts = function() {
    return this.templateParts_;
};
