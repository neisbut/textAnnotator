goog.provide('tvs.ImageTemplatePart');

goog.require('tvs.TemplatePart');

/**
 * @constructor
 * @param {string} content
 * @param {string} width Allowed values: *, height, [\d]px
 * @param {string} drawMode allowed values: repeat, stretch
 * @extends {tvs.TemplatePart}
 * @export
 */
tvs.ImageTemplatePart = function(content, width, drawMode) {
    goog.base(this);

    this.content = content;
    this.width = width;
    this.drawMode = drawMode || 'repeat';
};
goog.inherits(tvs.ImageTemplatePart, tvs.TemplatePart);

/**
 * [getBackground description]
 * @param  {string} color
 * @return {string}
 */
tvs.ImageTemplatePart.prototype.getBackground = function(color) {
    return tvs.AnnotatorCore.formatString(this.content, [color]);
};

/**
 * [getBackground description]
 * @param  {string} color
 * @return {string}
 */
tvs.ImageTemplatePart.prototype.getCssBackground = function(color) {
    return 'url("' + this.getBackground(color) + '")';
};

/**
 * @override
 */
tvs.ImageTemplatePart.prototype.applyToElement = function(element, prevEl, 
    annotationRect, partIndex, partsCount, color, starCost) {

        var bgIsSet = false;
        var td = element,
            prevTd = prevEl,
            rect = annotationRect;

        var widths = this.width.split(' ');
        switch (widths[0]) {
            case '*':
                td.style.width = starCost + '%';
                break;
            case 'height':
                td.style.width = td.style.minWidth = rect.height + 'px';
                td.style.maxWidth = td.style.width;
                break;
            case 'swag':
                if (!prevTd)
                    throw new Error('Swag part can not be the first');
                td.style.display = 'none';
                var img = goog.dom.createDom('img');
                if (widths[1]) {
                    img.style.display = 'none';
                    img.onload = function() {
                        this.style.height =
                            rect.height / +widths[1] * this.height;
                        this.style.display = '';
                    };
                }
                img.src = this.getBackground(color);
                img.style.left = (100 * partIndex / partsCount) + '%';
                goog.dom.appendChild(prevTd, img);
                bgIsSet = true;
                break;
            default:
                td.style.minWidth = td.style.width = goog.isNumber(this.width) ?
                    this.width + 'px' : this.width;
                break;
        }

        if (this.drawMode === 'stretch') {
            var img = goog.dom.createDom('img');
            goog.dom.appendChild(td, img);
            var self = this;
            // since we need to know actual size of the TD then we should
            // call resize just after annotation alement is added to page
            setTimeout(function() {
                self.resizeElement(td, annotationRect);
                img.src = self.getBackground(color);
                img.removeAttribute('width');
                img.removeAttribute('height');
            }, 10);
            bgIsSet = true;
        }
        if (goog.dom.getChildren(td).length === 0) {
            // mobiles demand something inside of td with auto width
            goog.dom.appendChild(td, goog.dom.createDom('div'));
        }

        if (!bgIsSet) {
            td.style['backgroundImage'] = this.getCssBackground(color);
            td.style['backgroundSize'] = 'auto 100%';
        }
    };

/**
 * @override
 */
tvs.ImageTemplatePart.prototype.resizeElement = function(element, rect) {
    // empty
};
