'use strict';

var pplaBuilder = require('../lib/ppla-builder.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

module.exports = {
    setUp: function(done) {
        pplaBuilder.resetLabelConfig();
        done();
    },
    testSingleLineBuild: function(test) {
        this.expectedFinalLabel = new Buffer('\u0002L\u000D4:5300101500010Etiqueta de teste\u000DE\u000D', 'ascii');
        test.expect(1);
        pplaBuilder.rotation(pplaBuilder.DIRECTIONS.LANDSCAPE)
            .fontType(pplaBuilder.FONT_TYPE[':'].value)
            .fontSubType(pplaBuilder.COURIER_SUBTYPES.ECMA94)
            .hScale(5)
            .vScale(3)
            .x(10)
            .y(150)
            .label('Etiqueta de teste');

        test.deepEqual(pplaBuilder.build(), this.expectedFinalLabel, 'should be ' + this.expectedFinalLabel);
        test.done();
    },
    testMultiLineBuild: function(test) {
        this.expectedFinalLabel = new Buffer('\u0002L\u000D4:5300101500010Etiqueta de teste\u000D2B220500200010098123456721\u000DE\u000D', 'ascii');
        test.expect(1);
        pplaBuilder.rotation(pplaBuilder.DIRECTIONS.LANDSCAPE)
            .fontType(pplaBuilder.FONT_TYPE[':'].value)
            .fontSubType(pplaBuilder.COURIER_SUBTYPES.ECMA94)
            .hScale(5)
            .vScale(3)
            .x(10)
            .y(150)
            .label('Etiqueta de teste')
            .newLine()
            .rotation(pplaBuilder.DIRECTIONS.REVERSE_LANDSCAPE)
            .barcodeType('B')
            .barcodeHeight('050')
            .wideBar(2)
            .narrowBar(2)
            .x(100)
            .y(200)
            .barcode('98123456721');
        test.deepEqual(pplaBuilder.build(), this.expectedFinalLabel, 'should be ' + this.expectedFinalLabel);
        test.done();
    },
    testSingleLineBuildWithPixelSizeConfig: function(test) {
        this.expectedFinalLabel = new Buffer('\u0002L\u000DD11\u000D111100000500050Test label\u000DE\u000D', 'ascii');
        test.expect(1);
        pplaBuilder.setPixelSize(11).label('Test label');
        test.deepEqual(pplaBuilder.build(), this.expectedFinalLabel, 'should be ' + this.expectedFinalLabel);
        test.done();
    },
    testSingleLineBuildWithMeasureInMeters: function(test){
        this.expectedFinalLabel = new Buffer('\u0002L\u000Dm\u000D111100000500050label\u000DE\u000D', 'ascii');
        test.expect(1);
        pplaBuilder.useMeasureInMeter().label('label');
        test.deepEqual(pplaBuilder.build(), this.expectedFinalLabel, 'should be ' + this.expectedFinalLabel);
        test.done();
    },
    testAssignDefaultValues: function(test){
        this.expectedDefaults = {
                "rotation": "1",
                "fontType": "1",
                "h": "0",
                "v": "0",
                "fontSubType": "000",
                "y": "0050",
                "x": "0050"
        };
        test.expect(1);
        pplaBuilder.overwriteDefaults({"h": "0", "v": "0", "invalidEntry": "10"});
        test.deepEqual(pplaBuilder.defaults, this.expectedDefaults, 'should be ' + this.expectedDefaults);
        test.done();
    }
};




