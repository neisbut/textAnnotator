goog.provide('tvs.AnnotatorDictionary');

goog.require('tvs.SvgTemplatePart');
goog.require('tvs.Template');

/**
 * Svg templates
 * @dict
 * @export
 */
tvs.AnnotatorDictionary.svgTemplates = {
    'squiggly': new tvs.Template(new tvs.SvgTemplatePart(
            '<line y2="16.00" x2="20" y1="4.00" ' +
                'x1="10" stroke-linecap="round" ' +
                'stroke-width="5" stroke="{0}" fill="none"/>' +
            '<line y2="4.00" x2="10" y1="16.00" ' +
                'x1="0" stroke-linecap="round" ' +
                'stroke-width="5" stroke="{0}" fill="none"/>',
            20, 20, '*', 'repeat'
        )),
    'solid': new tvs.Template(new tvs.SvgTemplatePart(
            '<line y2="3" x2="5" y1="3" ' +
                'x1="0" stroke-linecap="round" ' +
                'stroke-width="2" stroke="{0}" fill="none"/>',
            5, 5, '*', 'repeat'
        )),
    'dotted': new tvs.Template(new tvs.SvgTemplatePart(
            '<line y2="3" x2="4" y1="3" x1="0" ' +
                'stroke-dasharray="2, 2" ' +
                'stroke-width="2" stroke="{0}" fill="none"/>',
            4, 5, '*', 'repeat'
        )),
    'dashed': new tvs.Template(new tvs.SvgTemplatePart(
            '<line y2="3" x2="6" y1="3" x1="0" ' +
                'stroke-dasharray="4, 2" ' +
                'stroke-width="2" stroke="{0}" fill="none"/>',
            6, 5, '*', 'repeat'
        )),
    'double': new tvs.Template(new tvs.SvgTemplatePart(
            '<line y2="1" x2="5" y1="1" ' +
                'x1="0" stroke-linecap="round" ' +
                'stroke-width="1" stroke="{0}" fill="none"/>' +
            '<line y2="4" x2="5" y1="4" ' +
                'x1="0" stroke-linecap="round" ' +
                'stroke-width="1" stroke="{0}" fill="none"/>',
            5, 5, '*', 'repeat'
        )),
    'combined': new tvs.Template([
        new tvs.SvgTemplatePart(
            '<circle cx="5" cy="5" r="5" fill="{0}" />',
            10, 10, 'height', 'repeat'
        ),
        new tvs.SvgTemplatePart(
            '<line y2="5" x2="10" y1="5" ' +
                'x1="0" stroke-linecap="round" ' +
                'stroke-width="5" stroke="{0}"/>',
            10, 10, 'auto', 'repeat'
        ),
        new tvs.SvgTemplatePart(
            '<circle cx="5" cy="5" r="5" fill="{0}" />',
            10, 10, 'height', 'repeat'
        )
    ])
};

