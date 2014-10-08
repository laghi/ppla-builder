# ppla-builder [![Build Status](https://secure.travis-ci.org/laghi/ppla-builder.png?branch=master)](http://travis-ci.org/laghi/ppla-builder)

An easy way to build labels in ppla (printer programming language A).

I started this project as a way to get used to the printer programming language A,  
accepted by the Argox OS series (and others Argox printers). The main goal was to build easier the output 
for the printer, abstracting the need of knowing the exactly order of the configurations for a simple print 
line.
 
This project has no intent of covering all the commands available in the language, 
neither do complex configurations and generate complex print commands.

## Getting Started
Install the module with: `npm install ppla-builder`

```javascript
var pplaBuilder = require('ppla-builder');
```

## Documentation
_(Coming soon)_

## Examples

```javascript
   var pplaBuilder = require('ppla-builder');
   pplaBuilder.rotation(pplaBuilder.DIRECTIONS.LANDSCAPE)
                      .fontType(pplaBuilder.FONT_TYPE[':'].value)
                      .fontSubType(pplaBuilder.COURIER_SUBTYPES.ECMA94)
                      .hScale(5)
                      .vScale(3)
                      .x(100)
                      .y(150)
                      .label('This is a test label');
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_0.1.5_ <br />
Added alias for setting margin left.<br />
Added function to overwrite the defaults.<br />
Changed to Apache-2.0 License.<br />
_0.1.4_ <br />
Added alias for setting the measures in meter or inchs.<br />
_0.1.3_<br />
Added method for setting the label configurations.<br />
Added alias for setting the pixel size of the label.<br />
_0.1.2_<br />
Fixed some npm configurations<br />
_0.1.1_<br />
Added npm info in the packages.json<br />
_0.1.0_<br />
Initial features. Basic label and barcode formatting<br />


## License
Copyright (c) 2014 Murilo Laghi  
Licensed under the Apache-2.0 license.



