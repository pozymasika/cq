import 'babel-polyfill'
import chai from 'chai';
const assert = chai.assert;
import cq, { NodeTypes } from '../src/index';
import peg from 'pegjs';
import fs from 'fs';

let grammar = fs.readFileSync(__dirname + '/../src/query.pegjs').toString();
let parser = peg.buildParser(grammar);

describe('queryParserTest', () => {
  describe('parsing', () => {

    it('should return a top level identifier', () => {
      let actual = parser.parse('.Switch');
      let expected = {
        type: NodeTypes.IDENTIFIER,
        matcher: 'Switch'
      };
      assert.deepEqual(actual, expected);
    });

    it('should parse children', () => {
      let actual = parser.parse('.Switch .render .cat');
      let expected = {
        type: NodeTypes.IDENTIFIER,
        matcher: 'Switch',
        children: [{
          type: NodeTypes.IDENTIFIER,
          matcher: 'render',
          children: [{
            type: NodeTypes.IDENTIFIER,
            matcher: 'cat',
          }]
        }]
      };

      assert.deepEqual(actual, expected);
    });

    it('should parse ranges', () => {
      let actual = parser.parse('.hello-.Farm');
      let expected = {
        type: NodeTypes.RANGE,
        start: {
          type: NodeTypes.IDENTIFIER,
          matcher: 'hello'
        },
        end: {
          type: NodeTypes.IDENTIFIER,
          matcher: 'Farm'
        }
      };

      assert.deepEqual(actual, expected);
    });

    it('should parse children with ranges', () => {
      let actual = parser.parse('.Switch .renderOtherStuff-.render');
      let expected = {
        type: NodeTypes.IDENTIFIER,
        matcher: 'Switch',
        children: [{
          type: NodeTypes.RANGE,
          start: {
            type: NodeTypes.IDENTIFIER,
            matcher: 'renderOtherStuff'
          }, 
          end: {
            type: NodeTypes.IDENTIFIER,
            matcher: 'render'
          }
        }]
      };

      assert.deepEqual(actual, expected);
    });

    it('should parse ranges with children on the right', () => {
      let actual = parser.parse('.Switch-(.parent .child)');
      let expected = {
        type: NodeTypes.RANGE,
        start: {
          type: NodeTypes.IDENTIFIER,
          matcher: 'Switch'
        },
        end: {
          type: NodeTypes.IDENTIFIER,
          matcher: 'parent',
          children: [{
            type: NodeTypes.IDENTIFIER,
            matcher: 'child'
          }]
        }
      };

      assert.deepEqual(actual, expected);
    });

    it('should parse modifiers', () => {
      let actual = parser.parse('.Switch:-2,+2');
      let expected = {
        type: NodeTypes.IDENTIFIER,
        matcher: 'Switch',
        modifiers: [{
          type: NodeTypes.EXTRA_LINES,
          amount: -2
        }, {
          type: NodeTypes.EXTRA_LINES,
          amount: 2
        }]
      };
      assert.deepEqual(actual, expected);
    });

    it('should parse EOF in a range', () => {
      let actual = parser.parse('1-EOF');
      let expected = {
        type: NodeTypes.RANGE,
        start: {
          type: NodeTypes.LINE_NUMBER,
          value: 1
        },
        end: {
          type: NodeTypes.LINE_NUMBER,
          value: 'EOF'
        }
      };

      assert.deepEqual(actual, expected);
    });

    it('should parse a string', () => {
      let actual = parser.parse("'hi mom'");
      let expected = {
        type: NodeTypes.STRING,
        matcher: 'hi mom'
      };
      assert.deepEqual(actual, expected);
    });

    it('should parse a string with children', () => {
      let actual = parser.parse("'My Test' 'should work'");
      let expected = {
        type: NodeTypes.STRING,
        matcher: 'My Test',
        children: [{
          type: NodeTypes.STRING,
          matcher: 'should work'
        }]
      };
      assert.deepEqual(actual, expected);
    });

    it('should parse a string in a range', () => {
      let actual = parser.parse("1-'foo'");
      let expected = {
        type: NodeTypes.RANGE,
        start: {
          type: NodeTypes.LINE_NUMBER,
          value: 1
        },
        end: {
          type: NodeTypes.STRING,
          matcher: 'foo'
        }
      };
      assert.deepEqual(actual, expected);
    });


  });
});

// TODO should actually return an array and support that