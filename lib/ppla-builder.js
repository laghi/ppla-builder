/*
 * ppla-builder
 * https://github.com/laghi/ppla-builder
 *
 * Copyright (c) 2014 Murilo Laghi
 * Licensed under the GPL-3.0 license.
 */

'use strict';


var _ = require('lodash');
var undef;
var PplaBuilder;
PplaBuilder = {
    LABEL_PATTERN: 'Rthvoooyyyyxxxx[data string]',
    validDirections: _.range(1, 5),
    validScales: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
    DIRECTIONS: {
        PORTRAIT: 1,
        REVERSE_LANDSCAPE: 2,
        REVERSE_PORTRAIT: 3,
        LANDSCAPE: 4
    },
    BARCODE_TYPE: {

    },
    COURIER_SUBTYPES: {
        Roman8: '000',
        ECMA94: '001',
        PCset: '002',
        PCsetA: '003',
        PCsetB: '004',
        Legal: '005',
        Greek: '006',
        Russian: '007'
    },
    FONT_TYPE: {
        '0': { value: 0, subTypes: ['000']},
        '1': { value: 1, subTypes: ['000']},
        '2': { value: 2, subTypes: ['000']},
        '3': { value: 3, subTypes: ['000']},
        '4': { value: 4, subTypes: ['000']},
        '5': { value: 5, subTypes: ['000']},
        '6': { value: 6, subTypes: ['000']},
        '7': { value: 7, subTypes: ['000']},
        '8': { value: 8, subTypes: ['000']},
        '9': { value: 9, subTypes: ['000', '001', '002', '003', '004', '005', '006']},
        ':': { value: ':', subTypes: ['000', '001', '002', '003', '004', '005', '006', '007']
        }
    },
    defaults: {
        'rotation': '1',
        'fontType': '1',
        'h': '1',
        'v': '1',
        'fontSubType': '000',
        'y': '0100',
        'x': '0000'
    },
    lines: [],
    currentLine: {
        alreadyInLines: false
    },
    labelConfigs:{
    },
    resetLabelConfig: function(){
        this.labelConfigs = {};
    },
    setNewLabelConfig: function(key, value){
        this.labelConfigs[key] = value;
    },
    setPixelSize: function (newSize) {
        if (_.contains(_.range(11, 24), newSize)) {
            this.setNewLabelConfig("D", newSize);
        }
        return this;
    },
    rotation: function (newDirection) {
        if (_.contains(this.validDirections, newDirection)) {
            this.currentLine.rotation = newDirection;
        }
        return this;
    },
    fontType: function (newFontType, newFontSubType) {
        var newFontValue = String(newFontType);
        var newFontData = this.FONT_TYPE[newFontValue];
        if (!newFontData) {
            console.log('Font type not defined, because it is not supported');
            return this;
        }
        this.currentLine.fontType = newFontValue;
        if (newFontSubType) {
            this.fontSubType(newFontSubType);
        }
        return this;
    },
    fontSubType: function (newFontSubType) {
        var fontData = this.FONT_TYPE[this.currentLine.fontType];
        if (!fontData || !newFontSubType) {
            console.log('Font subtype not defined, because it is not supported');
            return this;
        }
        if (!(_.contains(fontData.subTypes, newFontSubType))) {
            console.log('Font subtype not defined. The specified font subtype cannot be used with the specified font type');
            return this;
        }
        this.currentLine.fontSubType = newFontSubType;
        return this;
    },
    hScale: function (h) {
        var newHScale = String(h);
        if (_.contains(this.validScales, newHScale)) {
            this.currentLine.h = newHScale;
        }
        return this;
    },
    vScale: function (v) {
        var newVScale = String(v);
        if (_.contains(this.validScales, newVScale)) {
            this.currentLine.v = newVScale;
        }
        return this;
    },
    wideBar: function (wB) {
        return this.hScale(wB);
    },
    narrowBar: function (nB) {
        return this.vScale(nB);
    },
    x: function (xCoordinate) {
        var newXCoordinate = xCoordinate ? String(xCoordinate) : undef;
        if (newXCoordinate) {
            this.currentLine.x = newXCoordinate;
        }
        return this;
    },
    y: function (yCoordinate) {
        var newYCoordinate = yCoordinate ? String(yCoordinate) : undef;
        if (newYCoordinate) {
            this.currentLine.y = newYCoordinate;
        }
        return this;
    },
    label: function (labelText) {
        if (labelText) {
            this.currentLine.label = labelText;
        }
        return this;
    },
    appendToLabel: function (labelText) {
        if (!labelText) {
            return this;
        }
        this.currentLine.label = this.currentLine.label || '';
        this.currentLine.label += labelText;
        return this;
    },
    appendToBarcode: function (barcodeText) {
        return this.appendToLabel(barcodeText);
    },
    barcodeType: function (newBarcodeType) {
        this.currentLine.fontType = newBarcodeType;
        return this;
    },
    barcodeHeight: function (barcodeH) {
        var size = _.size(barcodeH);
        if (size > 0 && size < 4) {
            this.currentLine.fontSubType = barcodeH;
        }
        return this;
    },
    barcode: function (barcodeText) {
        return this.label(barcodeText);
    },
    newLine: function () {
        this.lines.push(this.currentLine);
        this.currentLine = {};
        return this;
    },
    build: function () {
        if (!_.isEmpty(this.currentLine)) {
            this.lines.push(this.currentLine);
            this.currentLine = {};
        }
        var finalLabel = '\u0002L\u000D';
        _.each(this.labelConfigs, function(value, key){
            finalLabel += key + value + '\u000D';
        });
        _.each(this.lines, function(line){
            finalLabel += this.buildLine(line);
            finalLabel += line.label;
            finalLabel += '\u000D';
        }, this);
        finalLabel += 'E\u000D';
        this.lines = [];
        this.currentLine = {
            alreadyInLines: false
        };
        return new Buffer(finalLabel, 'ascii');
    },
    buildLine: function (lineToBuild) {
        var formattedLine = '';
        var configuration = _.clone(this.defaults);
        _.assign(configuration, lineToBuild);
        this.normalizeCoordinates(configuration);
        this.normalizeBarcodeHeight(configuration);
        formattedLine += configuration.rotation;
        formattedLine += configuration.fontType;
        formattedLine += configuration.h;
        formattedLine += configuration.v;
        formattedLine += configuration.fontSubType;
        formattedLine += configuration.y;
        formattedLine += configuration.x;
        return formattedLine;
    },
    normalizeCoordinates: function (configuration) {
        var x = configuration.x;
        var y = configuration.y;
        var paddingX = 4 - x.length;
        while (paddingX--) {
            x = '0' + x;
        }
        var paddingY = 4 - y.length;
        while (paddingY--) {
            y = '0' + y;
        }
        configuration.x = x;
        configuration.y = y;
    },
    normalizeBarcodeHeight: function (configuration) {
        var fontSubType = configuration.fontSubType;
        var paddingFontSubType = 3 - fontSubType.length;
        while (paddingFontSubType--) {
            fontSubType = '0' + fontSubType;
        }
        configuration.fontSubType = fontSubType;
    }
};

module.exports = PplaBuilder;


