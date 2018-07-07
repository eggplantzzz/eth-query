const expect = require('chai').expect;
const { validateInput } = require('../lib');

describe('validateInput(input)', () => {
  let wrappedFunction;
  describe('when the input is a positive number', () => {
    it('returns true', () => {
      expect(validateInput(123)).to.be.true;
    });
    it('returns true', () => {
      expect(validateInput(5.123)).to.be.true;
    });
  });
  describe('when the input is negative', () => {
    beforeEach(() => {
      wrappedFunction = () => validateInput(-123);
    });
    it('throws a type error', () => {
      expect(wrappedFunction).to.throw(TypeError);
    });
  });
  describe('when the input is a string', () => {
    beforeEach(() => {
      wrappedFunction = () => validateInput('string->thing');
    });
    it('throws a type error', () => {
      expect(wrappedFunction).to.throw(TypeError);
    });
  });
  describe('when the input is some other junk', () => {
    it('throws a type error for NaN', () => {
      wrappedFunction = () => validateInput(NaN);
      expect(wrappedFunction).to.throw(TypeError);
    });
    it('throws a type error for undefined', () => {
      wrappedFunction = () => validateInput(undefined);
      expect(wrappedFunction).to.throw(TypeError);
    });
    it('throws a type error for null', () => {
      wrappedFunction = () => validateInput(null);
      expect(wrappedFunction).to.throw(TypeError);
    });
    it('throws a type error for Infinity', () => {
      wrappedFunction = () => validateInput(Infinity);
      expect(wrappedFunction).to.throw(TypeError);
    });
  });
});
