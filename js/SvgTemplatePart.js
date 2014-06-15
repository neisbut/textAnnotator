goog.provide('tvs.SvgTemplatePart');

goog.require('goog.crypt.base64');
goog.require('tvs.AnnotatorCore');
goog.require('tvs.ImageTemplatePart');

/**
 * @constructor
 * @param {string} svgContent
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {string} templWidth
 * @extends {tvs.ImageTemplatePart}
 * @export
 */
tvs.SvgTemplatePart = function(
    svgContent, canvasWidth, canvasHeight, templWidth) {

    var content = tvs.AnnotatorCore.formatString(
        '<svg width="{0}" height="{1}" xmlns="http://www.w3.org/2000/svg">' +
                '<g>\n{2}\n</g>\n</svg>',
        [canvasWidth, canvasHeight, svgContent]
    );

    goog.base(this, content, templWidth);

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

};
goog.inherits(tvs.SvgTemplatePart, tvs.ImageTemplatePart);


/**
 * @override
 */
tvs.SvgTemplatePart.prototype.getBackground = function(color) {
    var image = tvs.AnnotatorCore.formatString(this.content, [color]);
    var encodedSVG = goog.crypt.base64.encodeString(image);
    return 'data:image/svg+xml;base64,' + encodedSVG;
};


/**
 * @override
 */
tvs.SvgTemplatePart.prototype.resizeElement = function(element, rect) {
    if (this.width === 'stretch') {
        var bounds = goog.style.getBounds(element);
        var img = goog.dom.getElementsByTagNameAndClass(
            'img', null, element)[0];

        img.style.transform = 'scaleX(' + (rect.width / this.canvasWidth) +
            ') scaleY(' + (rect.height / this.canvasHeight) + ')';

        img.style.webkitTransform = img.style.msTransform =
            img.style.transform;
    }
};


