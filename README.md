## textAnnotator

Small and simple JS tool for making powerful underline, highlight and strike text annotations.

See live demo at the [pages](http://neisbut.github.io/textAnnotator/)

## Quick Examples

### Annotate specific element:
```javascript
var u = new tvs.Annotator();
u.underline(element1, 'solid', 'red');
u.highlight(element2, 'brush', 'green');
u.strike(element3, 'dashed', 'blue');
```


### Annotation using attributes

```html
<span>Examples of text
    <span data-annotate='underline squiggly red'>to be underlined</span>, 
    <span data-annotate='highlight brush green'>to be highlighted</span>,
    <span data-annotate='strike dashed blue'>to be striked</span>
</span>
```

Then add to code:
```javascript
var u = new tvs.Annotator();
u.annotateDocument();
```

### Custom templates:
Use JS code to add new templates:
```javascript
tvs.AnnotatorDictionary.svgTemplates['custom'] = new tvs.Template(new tvs.SvgTemplatePart(
    '<line y2="3" x2="4" y1="3" x1="0" ' +
        'stroke-dasharray="2, 2" ' +
        'stroke-width="2" stroke="{0}" fill="none"/>', // svg content
    4,                                                 // width of canvas
    5,                                                 // height of canvas
    'repeat'                                           // apply method
));
```

## Is this doc full?

Sorry, but no. There is many hidden features which is not documented still (hope it will be soon). Not documented features:
* IE6+ support possible (but not implemented yet)
* complex templates supported (when template can contain parts with specified width, different and formats inside)
* Supported apply methods: repeat, stretch, swag, height, * and all possible css values
* and some others...
