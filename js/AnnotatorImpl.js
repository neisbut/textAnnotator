goog.provide('tvs.AnnotatorImpl');

goog.require('goog.Throttle');
goog.require('goog.style');
goog.require('tvs.ElementAnnotationInfo');
goog.require('tvs.IPositioner');

/**
 * @constructor
 * @param {?string} id
 * @param {!Object.<string, tvs.Template>} templates
 * @param {!tvs.IPositioner} positioner
 * @param {tvs.AnnotateOptions=} options
 */
tvs.AnnotatorImpl = function(id, templates, positioner, options) {
    this.id = id || 'annotator';

    this.positioner = positioner;
    this.templates = templates;

    // default options
    this.options = {
        'height': 5,
        'opacity': 0.9
    };
    this.setOptions(options || this.options);

    // subscribe for resize events using throttle
    this.throttle = new goog.Throttle(
        goog.bind(this.refreshAllAnnotations, this), 50);
    tvs.AnnotatorCore.registerForWindowResize(
        this.id, goog.bind(this.throttle.fire, this.throttle));

};

/**
 * Sets options
 * @param {tvs.AnnotateOptions} options
 */
tvs.AnnotatorImpl.prototype.setOptions = function(options) {
    goog.object.extend(this.options, options);
};

/**
 * Returns css class for annotated elemets
 * @return {string}
 */
tvs.AnnotatorImpl.prototype.getCssClassForAnnotated = function() {
    return 'tvs-' + this.id;
};

/**
 * Refreshes all annotations of a perticular type on a page
 */
tvs.AnnotatorImpl.prototype.refreshAllAnnotations = function() {
    var elems = goog.dom.getElementsByClass(this.getCssClassForAnnotated());
    var refFunc = goog.bind(this.refreshAnnotation, this);
    goog.array.forEach(elems, refFunc);
};

/**
 * setElementAnnotationInfo
 * @param {Element} elem
 * @param {Array.<Element>} allElems
 * @param {string} type
 * @param {string} color
 * @return {tvs.ElementAnnotationInfo}
 */
tvs.AnnotatorImpl.prototype.setElementAnnotationInfo =
    function(elem, allElems, type, color) {
        var key = '_' + this.id + '_info';
        return (elem['_' + this.id + '_info'] = new tvs.ElementAnnotationInfo(
            elem, allElems, key, type, color));
    };

/**
 * @param {Element} elem
 * @return {tvs.ElementAnnotationInfo}
 */
tvs.AnnotatorImpl.prototype.getElementAnnotationInfo = function(elem) {
    var key = '_' + this.id + '_info';
    return elem[key];
};

/**
 * Clears info
 * @param {Element} elem
 */
tvs.AnnotatorImpl.prototype.clearElementAnnotationInfo = function(elem) {

    var info = this.getElementAnnotationInfo(elem),
        self = this;
    if (!info)
        return;

    goog.array.forEach(info.annotationElements, function(el) {
        delete el['_' + self.id + '_for'];
    });

    info.remove();
};

/**
 * Refreshes specific element's annotation
 * @param  {Element|Event} elemOrEv
 */
tvs.AnnotatorImpl.prototype.refreshAnnotation = function(elemOrEv) {
    if (elemOrEv.target)
        elemOrEv = elemOrEv.srcElement;

    elemOrEv = /** @type {Element} */ (elemOrEv);

    var info = this.getElementAnnotationInfo(elemOrEv);

    if (!info)
        return;

    var parent = goog.dom.getDocument().body;
    var opts = this.options;

    var rects = elemOrEv.getClientRects();

    var equalCount = Math.min(rects.length, info.annotationElements.length);
    var template = this.templates[info.type];

    var yOffset = tvs.AnnotatorCore.getScrollOffsets().y;

    // resize
    for (var i = 0; i < equalCount; i++) {
        var r = goog.object.clone(rects[i]);
        r.top += yOffset;
        r.bottom += yOffset;
        if (typeof r.width === 'undefined') {
            r.width = r.right - r.left;
            r.height = r.bottom - r.top;
        }

        var position = this.positioner.getPosition(r, this.options.height);
        var s = info.annotationElements[i].style;
        s.width = position.width + 'px';
        s.left = position.left + 'px';
        s.top = position.top + 'px';
        goog.dom.getChildren(
            info.annotationElements[i])[0].style.width = s.width;

        this.resizeTemplate(template, info.annotationElements[i], position);
    }

    // delete unnecessary
    for (var i = equalCount; i < info.annotationElements.length; i++) {
        delete info.annotationElements[i]['_' + this.id + '_for'];
        goog.dom.removeNode(info.annotationElements[i]);
    }
    info.annotationElements.length = equalCount;

    // add new
    for (var i = equalCount; i < rects.length; i++) {
        var r = goog.object.clone(rects[i]);
        r.top += yOffset;
        r.bottom += yOffset;
        if (typeof r.width === 'undefined') {
            r.width = r.right - r.left;
            r.height = r.bottom - r.top;
        }

        var animatedDiv = goog.dom.createDom('div');
        animatedDiv.style.position = 'absolute';

        var div = goog.dom.createDom('div');
        goog.dom.classes.add(div, 'tvs-wrap-div');
        var position = this.positioner.getPosition(r, this.options.height);

        var table = this.templateToElement(template, info.color, position);
        goog.dom.appendChild(div, table);

        animatedDiv.style.height = div.style.height = position.height + 'px';
        animatedDiv.style.width = 0;
        div.style.width = position.width + 'px';
        animatedDiv.style.left = position.left + 'px';
        animatedDiv.style.top = position.top + 'px';
        animatedDiv.style.opacity = this.options.opacity;
        //var zIndex = goog.style.getComputedStyle(elemOrEv, 'zIndex');
        //animatedDiv.style.zIndex = goog.isNumber(zIndex) ? zIndex - 1 : -1;

        goog.dom.appendChild(parent, animatedDiv);
        goog.dom.appendChild(animatedDiv, div);
        info.annotationElements.push(animatedDiv);

        // link annotation element to annotated element
        animatedDiv['_' + this.id + '_for'] = elemOrEv;

        this.resizeTemplate(template, table, position);
        goog.dom.classes.enable(animatedDiv, 'tvs-annotate-element', true);

        (function(adiv, idiv) {
            setTimeout(function() {
                adiv.style.width = idiv.style.width;
            }, 10);
        })(animatedDiv, div);

    }
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {string} type
 * @param {string} color
 * @return {Array.<tvs.ElementAnnotationInfo>}
 */
tvs.AnnotatorImpl.prototype.annotate = function(elems, type, color) {
    var elems_ = goog.isArray(elems) ? goog.array.clone(elems) : [elems],
        self = this,
        cssClass = this.getCssClassForAnnotated(),
        annotationElements = [];

    this.unannotate(elems);

    goog.array.forEach(elems_, function(el) {
        annotationElements.push(
            self.setElementAnnotationInfo(el, elems_, type, color));
        goog.dom.classes.enable(el, cssClass, true);

        self.refreshAnnotation(el);
    });

    return annotationElements;
};

/**
 * @param {Array.<Element>|Element} elems
 * @param {boolean=} currentOnly
 * @return {Array.<Element>} list of unannotated elements
 */
tvs.AnnotatorImpl.prototype.unannotate = function(elems, currentOnly) {
    var elems_ = goog.isArray(elems) ? elems : [elems],
        self = this,
        cssClass = this.getCssClassForAnnotated(),
        unannotated = [];

    goog.array.forEach(elems_, function(el) {

        if (goog.dom.classes.has(el, 'tvs-annotate-element'))
            el = el['_' + self.id + '_for'];

        if (!el)
            return;

        var info = self.getElementAnnotationInfo(el);
        if (!info)
            return;
        var allAnnotated = info.annotatedElements;

        self.clearElementAnnotationInfo(el);
        goog.dom.classes.enable(el, cssClass, false);

        if (!currentOnly) {
            self.unannotate(allAnnotated);
            unannotated = goog.array.concat(unannotated, allAnnotated);
        }
        else
            unannotated.push(el);
    });

    return unannotated;
};

/**
 * Transforms template to table element
 * @param  {tvs.Template} t
 * @param {string} color
 * @param {Object} rect
 * @return {Element}
 */
tvs.AnnotatorImpl.prototype.templateToElement = function(t, color, rect) {
    var table = goog.dom.createDom('table'),
        tr = goog.dom.createDom('tr'),
        opts = this.options,
        template = t;

    goog.dom.appendChild(table, tr);

    var countStars = 0,
        parts = template.getParts();
    goog.array.forEach(parts, function(p) {
        if (p.width === '*')
            countStars++;
    });

    var starCost = countStars > 0 ? 100.0 / countStars : 100,
        prevTd;

    goog.array.forEach(parts, function(p, partIndex) {
        var td = goog.dom.createDom('td');

        p.applyToElement(
            td, prevTd, rect, partIndex, parts.length, color, starCost);

        goog.dom.appendChild(tr, td);
        prevTd = td;
    });

    return table;
};

/**
 * @param {tvs.Template} template
 * @param {Element} element
 * @param {Object} rect
 */
tvs.AnnotatorImpl.prototype.resizeTemplate = function(template, element, rect) {

    var parts = template.getParts();
    var tds = goog.dom.getElementsByTagNameAndClass('td', null, element);

    goog.array.forEach(parts, function(p, i) {
        p.resizeElement(tds[i], rect);
    });

};


