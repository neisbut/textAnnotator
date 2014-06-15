goog.provide('tvs.Annotator');

goog.require('tvs.AnnotatorDictionary');
goog.require('tvs.AnnotatorImpl');

/**
 * @constructor
 * @export
 */
tvs.Annotator = function() {

    this.underliner_ = new tvs.AnnotatorImpl(
        'underliner',
        tvs.Annotator.getTemplates(),
        tvs.AnnotatorCore.underlinePositioner);

    this.highlighter_ = new tvs.AnnotatorImpl(
        'highlighter',
        tvs.Annotator.getTemplates(),
        tvs.AnnotatorCore.highlightPositioner);

    this.striker_ = new tvs.AnnotatorImpl(
        'striker',
        tvs.Annotator.getTemplates(),
        tvs.AnnotatorCore.strikePositioner);
};

/**
 * Returns templates list
 * @return {!Object.<string, tvs.Template>}
 * @export
 */
tvs.Annotator.getTemplates = function() {
    return tvs.AnnotatorDictionary.svgTemplates;
};

/**
 * Sets underline options
 * @param {tvs.AnnotateOptions} options
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.setUnderlineOptions = function(options) {
    this.underliner_.setOptions(options);
    return this;
};

/**
 * Sets highlight options
 * @param {tvs.AnnotateOptions} options
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.setHighlightOptions = function(options) {
    this.highlighter_.setOptions(options);
    return this;
};

/**
 * Sets strike options
 * @param {tvs.AnnotateOptions} options
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.setStrikeOptions = function(options) {
    this.striker_.setOptions(options);
    return this;
};

/**
 * Returns templates list
 * @return {!Object.<string, tvs.Template>}
 * @export
 */
tvs.Annotator.prototype.getTemplates = function() {
    return tvs.Annotator.getTemplates();
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.underline = function(elems, type, color) {
    this.underliner_.annotate(elems, type, color);
    return this;
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.highlight = function(elems, type, color) {
    this.highlighter_.annotate(elems, type, color);
    return this;
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.strike = function(elems, type, color) {
    this.striker_.annotate(elems, type, color);
    return this;
};

/**
 * @param {string} method
 * @param {string} type
 * @param {string} color
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.annotateSelected = function(method, type, color) {

    if (typeof rangy === 'undefined')
        throw new Error('Rangy Framework is not found');

    var sel = rangy.getSelection(),
        self = this,
        func = this[method];

    if (!this.rangyClassApplier) {
        rangy.init();
        this.rangyClassApplier = rangy.createCssClassApplier(
            'tvs-annotated-text');
    }
    this.rangyClassApplier.applyToSelection();
    var annotated = [];

    goog.array.forEach(sel.getAllRanges(), function(range) {
        goog.array.forEach(range.getNodes(), function(node) {
            var el = self.rangyClassApplier.getSelfOrAncestorWithClass(node);
            if (el && goog.dom.classes.has(el, 'tvs-annotated-text') &&
                !goog.array.contains(annotated, el)) {
                annotated.push(el);
                func.apply(self, [el, type, color]);
            }
        });
    });
    return this;
};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.underlineSelected = function(type, color) {
    return this.annotateSelected('underline', type, color);
};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.highlightSelected = function(type, color) {
    return this.annotateSelected('highlight', type, color);
};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {tvs.Annotator}
 */
tvs.Annotator.prototype.strikeSelected = function(type, color) {
    return this.annotateSelected('strike', type, color);
};
