const chai = require('chai')
  , states = require('./../src/states')
  , validators = require('./../src/validators');

chai.should();

describe('validators', () => {
  describe('isValidOffset()', () => {
    it('accepts a multiples of 20', () => {
      validators.isValidOffset(40).should.be.true;
      validators.isValidOffset(20).should.be.true;
      validators.isValidOffset(60).should.be.true;
    });

    it('accepts non-multiples of 20', () => {
      validators.isValidOffset(2).should.be.false;
      validators.isValidOffset(38).should.be.false;
    });

    it('accepts 0', () => {
      validators.isValidOffset(0).should.be.true;
    });

    it('rejects no argument', () => validators.isValidOffset().should.be.false);

    it ('rejects non-numeric strings', () => {
      validators.isValidOffset('sdf').should.be.false;
      validators.isValidOffset('').should.be.false;
    });

    it('accepts multiples of 20 as strings', () => {
      validators.isValidOffset('20').should.be.true;
      validators.isValidOffset('60').should.be.true;
      validators.isValidOffset('100').should.be.true;
    });
  });

  describe('isValidApiKey()', () => {
    it('accepts a non-empty string', () => {
      validators.isValidApiKey('SOME_KEY').should.be.true;
    });

    context('invalid API keys', () => [
      ['', 'an empty string'],
      [2, 'a number'],
      [null, 'a null value'],
      [{}, 'an object']
    ].forEach(([invalidApiKey, descriptorFragment]) => it(
      `rejects ${descriptorFragment}`,
      () => validators.isValidApiKey(invalidApiKey).should.be.false
    )));
  });

  describe('isValidType()', () => {
    it("accepts a type if it's in the map", () => {
      validators.isValidType('some_type', ['some_type']).should.be.true;
    });

    it("rejects a type if it's not in the map", () => {
      validators.isValidType('another_type', ['some_type']).should.be.false;
    });
  });

  describe('isValidChamber()', () => {
    ['senate', 'house'].forEach((validChamber) => it(
      `accepts '${validChamber}'`,
      () => validators.isValidChamber(validChamber).should.be.true
    ));

    it('rejects anything else', () => {
      validators.isValidChamber('').should.be.false;
      validators.isValidChamber().should.be.false;
      validators.isValidChamber(null).should.be.false;
      validators.isValidChamber({}).should.be.false;
    });
  });

  describe('isValidCongress()', () => {
    context('without a lower limit', () => {
      it('accepts the current session and lower', () => {
        validators.isValidCongress(115).should.be.true;
        validators.isValidCongress(100).should.be.true;
      });

      it('rejects any sessions past the current congress', () => {
        validators.isValidCongress(116).should.be.false;
        validators.isValidCongress(200).should.be.false;
      });

      it('rejects non-numeric values', () => {
        validators.isValidCongress(null).should.be.false;
        validators.isValidCongress().should.be.false;
        validators.isValidCongress('an invalid session').should.be.false;
        validators.isValidCongress({}).should.be.false;
      });
    });

    context('with a lower limit', () => {
      it('rejects any sessions past the current congress', () => {
        validators.isValidCongress(116, 108).should.be.false;
        validators.isValidCongress(200, 108).should.be.false;
      });

      it('rejects sessions before the lower limit', () => {
        validators.isValidCongress(101, 108).should.be.false;
      });

      it('accepts a session after and including the lower limit', () => {
        validators.isValidCongress(108, 108).should.be.true;
      });
    });
  });

  describe('isValidBillId()', () => {
    it("accepts strings that begin with 'hr' followed by numbers", () => {
      validators.isValidBillId('hres123').should.be.true;
    });

    it("rejects anything that doesn't begin with 'hr' followed by numbers", () => {
      validators.isValidBillId('hr').should.be.false;
      validators.isValidBillId('123').should.be.false;
      validators.isValidBillId(123).should.be.false;
      validators.isValidBillId(null).should.be.false;
      validators.isValidBillId({}).should.be.false;
    });
  });

  describe('isValidMemberId()', () => {
    it('accepts a capital letter followed by 6 numbers', () => {
      validators.isValidMemberId('K000388').should.be.true;
    });

    it('rejects everything else', () => {
      validators.isValidMemberId('k000388').should.be.false;
      validators.isValidMemberId('K00038').should.be.false;
      validators.isValidMemberId('KK000388').should.be.false;
      validators.isValidMemberId(123).should.be.false;
      validators.isValidMemberId(null).should.be.false;
      validators.isValidMemberId({}).should.be.false;
    });
  });

  describe('isValidState()', () => {
    states.forEach(state => it(
      `accepts '${state}'`,
      () => validators.isValidState(state).should.be.true
    ));

    it('rejects anything else', () => {
      validators.isValidState().should.be.false;
      validators.isValidState('NON').should.be.false;
      validators.isValidState(123).should.be.false;
      validators.isValidState(null).should.be.false;
      validators.isValidState({}).should.be.false;
    });
  });

  describe('isValidDistrict()', () => {
    it('accepts numbers greater than 0', () => {
      validators.isValidDistrict(1).should.be.true;
      validators.isValidDistrict(3).should.be.true;
      validators.isValidDistrict(12).should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidDistrict().should.be.false;
      validators.isValidDistrict('NON').should.be.false;
      validators.isValidDistrict(0).should.be.false;
      validators.isValidDistrict(null).should.be.false;
      validators.isValidDistrict({}).should.be.false;
    });
  });

  describe('isValidSessionNumber()', () => {
    it('only accepts 1 and 2', () => {
      validators.isValidSessionNumber(1).should.be.true;
      validators.isValidSessionNumber(2).should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidSessionNumber().should.be.false;
      validators.isValidSessionNumber('NON').should.be.false;
      validators.isValidSessionNumber('N123').should.be.false;
      validators.isValidSessionNumber(0).should.be.false;
      validators.isValidSessionNumber(null).should.be.false;
      validators.isValidSessionNumber(3).should.be.false;
      validators.isValidSessionNumber({}).should.be.false;
    });
  });

  describe('isValidRollCallNumber()', () => {
    it('accepts numbers greater than 0', () => {
      validators.isValidRollCallNumber(1).should.be.true;
      validators.isValidRollCallNumber(3).should.be.true;
      validators.isValidRollCallNumber(12).should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidRollCallNumber().should.be.false;
      validators.isValidRollCallNumber('NON').should.be.false;
      validators.isValidRollCallNumber(0).should.be.false;
      validators.isValidRollCallNumber(null).should.be.false;
      validators.isValidRollCallNumber({}).should.be.false;
    });
  });

  describe('isValidYear()', () => {
    it('accepts years in YYYY format', () => {
      validators.isValidYear('2001').should.be.true;
      validators.isValidYear('2013').should.be.true;
      validators.isValidYear('1992').should.be.true;
      validators.isValidYear('1986').should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidYear().should.be.false;
      validators.isValidYear('NON').should.be.false;
      validators.isValidYear(0).should.be.false;
      validators.isValidYear(null).should.be.false;
      validators.isValidYear({}).should.be.false;
    });
  });

  describe('isValidMonth()', () => {
    it('accepts months in MM format', () => {
      validators.isValidMonth('01').should.be.true;
      validators.isValidMonth('12').should.be.true;
      validators.isValidMonth('08').should.be.true;
      validators.isValidMonth('10').should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidMonth().should.be.false;
      validators.isValidMonth('NON').should.be.false;
      validators.isValidMonth('13').should.be.false;
      validators.isValidMonth('1').should.be.false;
      validators.isValidMonth(0).should.be.false;
      validators.isValidMonth(null).should.be.false;
      validators.isValidMonth({}).should.be.false;
    });
  });

  describe('isValidCommitteeId()', () => {
    it("accepts four-character alpha strings beginning with HS or SS", () => {
      validators.isValidCommitteeId('HSHA').should.be.true;
      validators.isValidCommitteeId('SSCM').should.be.true;
    });

    it('rejects anything else', () => {
      validators.isValidCommitteeId().should.be.false;
      validators.isValidCommitteeId('HS').should.be.false;
      validators.isValidCommitteeId('SSB').should.be.false;
      validators.isValidCommitteeId('1').should.be.false;
      validators.isValidCommitteeId(0).should.be.false;
      validators.isValidCommitteeId(null).should.be.false;
      validators.isValidCommitteeId({}).should.be.false;
    });
  });
});
