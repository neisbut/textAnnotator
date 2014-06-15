goog.provide('tvs.ImageTemplatePart');

goog.require('tvs.TemplatePart');

/**
 * @constructor
 * @param {string} content
 * @param {string} width Allowed values: *, repeat, stretch, [\d]px
 * @extends {tvs.TemplatePart}
 * @export
 */
tvs.ImageTemplatePart = function(content, width) {
    goog.base(this);

    this.content = content;
    this.width = width;
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
            case 'repeat':
                td.style.width = 'auto';
                // mobiles demand something inside of td with auto width
                goog.dom.appendChild(td, goog.dom.createDom('div'));
                break;
            case 'height':
                td.style.width = rect.height;
                td.style.maxWidth = rect.height;
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
            case 'stretch':
                var img = goog.dom.createDom('img');
                img.src = this.getBackground(color);
                goog.dom.appendChild(td, img);
                img.removeAttribute('width');
                img.removeAttribute('height');
                bgIsSet = true;
                break;
            default:
                td.style.width = goog.isNumber(this.width) ?
                    this.width + 'px' : this.width;
                break;
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
