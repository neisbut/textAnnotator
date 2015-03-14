goog.provide('tvs.AnnotatorCore');

goog.require('goog.dom');


/**
 * @typedef {{
 *     height: (number|undefined),
 *     opacity: (number|undefined)
 * }}
 */
tvs.AnnotateOptions;

/**
 * Formats string in sprintf style
 * @param {string} str
 * @param {Array|Object} args
 * @return {string}
 */
tvs.AnnotatorCore.formatString = function(str, args) {
    return str.replace(/{([0-9a-zA-Z]+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

/**
 * window resize handlers
 * @type {Object.<string, Function>}
 */
tvs.AnnotatorCore.windowResizeHandlers = {};

/**
 * registers window.resize event handler
 * @param {string} key
 * @param {Function} func
 */
tvs.AnnotatorCore.registerForWindowResize = function(key, func) {
    if (typeof tvs.AnnotatorCore.windowResizeHandlers[key] !== 'undefined')
        return;

    tvs.AnnotatorCore.windowResizeHandlers[key] = func;
    goog.events.listen(window, 'resize', func);
};

/**
 * Underline positioner
 * @implements {tvs.IPositioner}
 */
tvs.AnnotatorCore.underlinePositioner = /** @type {!tvs.IPositioner} */ ({
    /**
     * @param {Object} elementRect
     * @param {number} annotationHeight
     * @return {{left: number, top: number, width: number, height: number}}
     */
    getPosition: function(elementRect, annotationHeight) {
        return {
            width: elementRect.width,
            height: annotationHeight,
            left: elementRect.left,
            top: elementRect.bottom - (elementRect.height * 0.1)
        };
    }
});

/**
 * Highlight positioner
 * @implements {tvs.IPositioner}
 */
tvs.AnnotatorCore.highlightPositioner = /** @type {!tvs.IPositioner} */ ({
    /**
     * @param {Object} elementRect
     * @param {number} annotationHeight
     * @return {Object}
     */
    getPosition: function(elementRect, annotationHeight) {
        return {
            width: elementRect.width,
            height: elementRect.height,
            left: elementRect.left,
            top: elementRect.top
        };
    }
});

/**
 * Strike positioner
 * @implements {tvs.IPositioner}
 */
tvs.AnnotatorCore.strikePositioner = /** @type {!tvs.IPositioner} */ ({
    /**
     * @param {Object} elementRect
     * @param {number} annotationHeight
     * @return {Object}
     */
    getPosition: function(elementRect, annotationHeight) {
        return {
            width: elementRect.width,
            height: annotationHeight,
            left: elementRect.left,
            top: elementRect.top + (elementRect.height - annotationHeight) / 2
        };
    }
});

/**
 * http://stackoverflow.com/questions/10286162/pageyoffset-scrolling-and-animation-in-ie8
 * @return {Object}
 */
tvs.AnnotatorCore.getScrollOffsets = function() {

    // This works for all browsers except IE versions 8 and before
    if (window.pageXOffset != null)
       return {
           x: window.pageXOffset,
           y: window.pageYOffset
       };

    // For browsers in Standards mode
    var doc = window.document;
    if (document.compatMode === 'CSS1Compat') {
        return {
            x: doc.documentElement.scrollLeft,
            y: doc.documentElement.scrollTop
        };
    }

    // For browsers in Quirks mode
    return {
        x: doc.body.scrollLeft,
        y: doc.body.scrollTop
    };
};

