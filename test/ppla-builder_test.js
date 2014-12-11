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
    testOverwriteDefaultValues: function(test){
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
    },
    testSetMarginLeft: function(test){
        this.expectedFinalLabel = new Buffer('\u0002L\u000DC0040\u000D111100000500050label\u000DE\u000D', 'ascii');
        pplaBuilder.resetDefaults();
        test.expect(1);
        pplaBuilder.setMarginLeft(40).label('label');
        test.deepEqual(pplaBuilder.build(), this.expectedFinalLabel, 'should be ' + this.expectedFinalLabel);
        test.done();
    },
    testPrint: function(test){
        var fonttype = pplaBuilder.FONT_TYPE["9"];
        var LabelBuilder = {
            buildAndPrintLabel: function(sabor){
                pplaBuilder.resetLabelConfig().useMeasureInMeter().setPixelSize(11);
                this.buildTitle(pplaBuilder);
                this.buildSabor(pplaBuilder, sabor);
                this.buildDataFabricacao(pplaBuilder, "20/10/2014");
                this.buildDataValidade(pplaBuilder, "20/04/2015");
                this.buildLote(pplaBuilder, "20/04/2015");
                this.buildQRCode(pplaBuilder);
                this.buildSaborBarcode(pplaBuilder, "7956321856148");
                this.buildCaixaBarcode(pplaBuilder, "0000000000001");
                return pplaBuilder.build();

            },
            buildTitle: function (pplaBuilder) {
                return pplaBuilder
                    .hScale(2)
                    .vScale(2)
                    .x(20)
                    .y(590)
                    .label('Paletas') // TODO externalizar para MessageResources
                    .newLine();
            },
            buildSabor: function(pplaBuilder, sabor){
                return pplaBuilder
                    .fontType(fonttype.value, fonttype.subTypes[3])
                    .hScale(1)
                    .vScale(1)
                    .x(20)
                    .y(190)
                    .label(sabor)
                    .newLine();
            },
            buildDataFabricacao: function(pplaBuilder, dataFabricacao){
                return pplaBuilder
                    .fontType(fonttype.value, fonttype.subTypes[2])
                    .hScale(1)
                    .vScale(1)
                    .x(20)
                    .y(170)
                    .label("Fabricacao: " + dataFabricacao) // TODO externalizar para MessageResources
                    .newLine();
            },
            buildDataValidade: function(pplaBuilder, dataValidade){
                return pplaBuilder
                    .fontType(fonttype.value, fonttype.subTypes[2])
                    .hScale(1)
                    .vScale(1)
                    .x(20)
                    .y(150)
                    .label("Validade: " + dataValidade) // TODO externalizar para MessageResources
                    .newLine();
            },
            buildLote: function(pplaBuilder, cdLote){
                return pplaBuilder
                    .fontType(fonttype.value, fonttype.subTypes[2])
                    .hScale(1)
                    .vScale(1)
                    .x(20)
                    .y(130)
                    .label("Lote: " + cdLote) // TODO externalizar para MessageResources
                    .newLine();
            },
            buildQRCode: function(pplaBuilder){
                return pplaBuilder
                    .barcodeType('W1d')
                    .x(20)
                    .y(20)
                    .narrowBar(5)
                    .wideBar(5)
                    .barcode(" Bundinha ")
                    .newLine();
            },
            buildSaborBarcode: function(pplaBuilder, saborBarcode){
                return pplaBuilder
                    .barcodeType('F')
                    .x(100)
                    .y(20)
                    .barcode(saborBarcode)
                    .newLine();
            },
            buildCaixaBarcode: function(pplaBuilder, loteBarcode){
                return pplaBuilder
                    .barcodeType('F')
                    .x(150)
                    .y(20)
                    .barcode(loteBarcode)
                    .newLine();
            }
        };
        var fs = require('fs');
        var exec = require('child_process').exec;
        var labelBuffer = LabelBuilder.buildAndPrintLabel("Sabor Morango Recheado com Leite Condensado");
        var labelUuid = "12345678";
        var stream = fs.createWriteStream("/tmp/" + labelUuid + ".ppla");
        console.log(labelBuffer);
        stream.once('open', function() {
            stream.write(labelBuffer);
            stream.end(sendToPrinter);
        });
        var sendToPrinter = function(){
            exec('lp -d Argox -o raw /tmp/' + labelUuid + '.ppla',
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
            console.log('budinha');
        };
        test.done();

    }
};




