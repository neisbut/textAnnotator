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
        tvs.AnnotatorCore.highlightPositioner,
        {opacity: 0.45});

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
 * Checks if svg supproted
 * @return {boolean}
 * @export
 */
tvs.Annotator.isSvgSupported = function() {
    return document.implementation.hasFeature(
        'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
};

/**
 * Annotates document. It searches for attributes like data-annotate and does
 * the specified annotation
 * @export
 */
tvs.Annotator.prototype.annotateDocument = function() {
    var elems = document.querySelectorAll('[data-annotate]');
    var self = this;
    var goodNames = ['underline', 'highlight', 'strike'];

    goog.array.forEach(elems, function(el) {
        var s = (el.getAttribute('data-annotate') || '');
        var params = s.split(/\s+/);
        if (params.length !== 3) {
            window.console.log('data-annotate problem with "' + s +
                '" 3 parameters expected');
            return;
        }

        if (!goog.array.contains(goodNames, params[0])) {
            window.console.log('data-annotate problem with "' + s +
                '" unknown operation');
            return;
        }

        self[params[0]](el, params[1], params[2]);
    });
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
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.underline = function(elems, type, color) {
    return this.underliner_.annotate(elems, type, color);
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @export
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.highlight = function(elems, type, color) {
    return this.highlighter_.annotate(elems, type, color);
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @export
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.strike = function(elems, type, color) {
    return this.striker_.annotate(elems, type, color);
};

/**
 * @param {string} method
 * @param {string} type
 * @param {string} color
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.annotateSelected = function(method, type, color) {

    if (typeof rangy === 'undefined')
        throw new Error('Rangy Framework is not found');

    var sel = rangy.getSelection(),
        self = this,
        func = this[method];

    if (!this.rangyClassApplier) {
        rangy.init();
        this.rangyClassApplier = rangy.createClassApplier(
            'tvs-annotated-text');
    }
    this.rangyClassApplier.applyToSelection();

    // array for listing annotated elements and for preventing multiple calls
    var annotated = [];

    goog.array.forEach(sel.getAllRanges(), function(range) {
        goog.array.forEach(range.getNodes(), function(node) {
            var el = self.rangyClassApplier.getSelfOrAncestorWithClass(node);
            if (el && goog.dom.classes.has(el, 'tvs-annotated-text') &&
                !goog.array.contains(annotated, el)) {
                annotated.push(el);
            }
        });
    });

    // clean up resources
    rangy.getSelection().detach();

    return goog.array.flatten(func.apply(self, [annotated, type, color]));
};

/**
 * unannotate elememt
 * @param {Element} el
 * @export
 */
tvs.Annotator.prototype.unannotateElement = function(el) {
    var toUnwrap = [],
        self = this;

    toUnwrap = goog.array.concat(toUnwrap, this.underliner_.unannotate(el));
    toUnwrap = goog.array.concat(toUnwrap, this.highlighter_.unannotate(el));
    toUnwrap = goog.array.concat(toUnwrap, this.striker_.unannotate(el));

    goog.array.forEach(toUnwrap, function(el) {
        if (!goog.dom.getParentElement(el))
            return;

        var range = rangy.createRange();
        range.selectNode(el);
        self.rangyClassApplier.undoToRange(range);
    });

};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.underlineSelected = function(type, color) {
    return this.annotateSelected('underline', type, color);
};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.highlightSelected = function(type, color) {
    return this.annotateSelected('highlight', type, color);
};

/**
 * @param {string} type
 * @param {string} color
 * @export
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.Annotator.prototype.strikeSelected = function(type, color) {
    return this.annotateSelected('strike', type, color);
};
