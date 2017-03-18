const {replace, when, verify, object, matchers: {
  anything,
  argThat
}} = require('testdouble')
  , {CURRENT_CONGRESS} = require('./../src/defaults');

require('chai').use(require('chai-as-promised')).should();

// aliases to verify and when with the ignoreExtraArgs config option set
const looseWhen = fakeInvocation => when(fakeInvocation, {ignoreExtraArgs: true});
const looseVerify = fakeInvocation => verify(fakeInvocation, {ignoreExtraArgs: true});

describe('pro-publica-congress', () => {
  let apiModule, validators, createPpc;
  beforeEach(() => {
    apiModule = replace('./../src/api');
    validators = replace('./../src/validators');
    createPpc = require('./../src/index').create;

    // some magic here to reduce duplication
    Object.keys(validators)
      .filter(methodName => methodName.indexOf('isValid') === 0)
      .forEach(methodName => {
        // validation invocations pass by default
        looseWhen(validators[methodName]())
          .thenReturn(true);

        // validation invocations with the first argument beginning with '{invalid-' will return false
        looseWhen(validators[methodName](argThat(arg => `${arg}`.indexOf('{invalid-') > -1)))
          .thenReturn(false);
      });
  });

  describe('create()', () => {
    it(
      "sets a 'congress' property to the given argument",
      () => createPpc('PROPUBLICA_API_KEY', '{congress}').congress.should.equal('{congress}')
    );

    it(
      'uses the current congress by default',
      () => createPpc('PROPUBLICA_API_KEY').congress.should.equal(CURRENT_CONGRESS)
    );

    it('throws with an invalid congress', () => {
      (() => createPpc('PROPUBLICA_API_KEY', '{invalid-congress}'))
        .should.throw(Error, 'Received invalid congress:');
    });

    it("sets a 'api' property to a api created with the given key argument", () => {
      const expectedClient = {};
      when(apiModule.create('PROPUBLICA_API_KEY'))
        .thenReturn(expectedClient);

      createPpc('PROPUBLICA_API_KEY', '{congress}').api
        .should.equal(expectedClient);
    });
  });

  describe('instance methods', () => {
    let ppc, api;
    beforeEach(() => {
      api = object(['get']);
      when(apiModule.create(anything())).thenReturn(api);
      looseWhen(api.get()).thenResolve({});

      ppc = createPpc('PROPUBLICA_API_KEY', '{congress}');
    });

    describe('.getRecentBills()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/bills/{recent-bill-type}'", () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/bills/{recent-bill-type}')));
      });

      it("performs request to the endpoint respecting the given congress", () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/bills/{recent-bill-type}')));
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}')
          .then(() => verify(api.get(anything(), 0 )));
      });

      it('sets the given offset', () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getRecentBills('{invalid-chamber}', '{recent-bill-type}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('rejects with an invalid congress', () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against the 105th congress as the earliest', () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}')
          .then(() => verify(validators.isValidCongress(anything(), 105)));
      });

      it('validates against recent bill types', () => {
        return ppc.getRecentBills('{chamber}', '{recent-bill-type}')
          .then(() => verify(validators.isValidType('{recent-bill-type}', [
            'introduced',
            'updated',
            'passed',
            'major'
          ])));
      });

      it('rejects with an invalid recent bill type', () => {
        return ppc.getRecentBills('{chamber}', '{invalid-recent-bill-type}')
          .should.be.rejectedWith(Error, 'Received invalid recent bill type:');
      });
    });

    describe('.getBill()', () => {
      it("performs a request to an endpoint resembling '{congress}/bills/{bill-id}'", () => {
        return ppc.getBill('{bill-id}')
          .then(() => looseVerify(api.get('{congress}/bills/{bill-id}')));
      });

      it("performs request to the endpoint respecting the given congress", () => {
        return ppc.getBill('{bill-id}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/bills/{bill-id}')));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getBill('{bill-id}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against the 105th congress as the earliest', () => {
        return ppc.getBill('{bill-id}')
          .then(() => verify(validators.isValidCongress(anything(), 105)));
      });

      it('rejects with an invalid bill ID', () => {
        return ppc.getBill('{invalid-bill-id}')
          .should.be.rejectedWith(Error, 'Received invalid bill id:');
      });
    });

    describe('.getAdditionalBillDetails()', () => {
      it("performs a request to an endpoint resembling '{congress}/bills/{bill-id}/{additional-bill-detail-type}'", () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}')
          .then(() => looseVerify(api.get('{congress}/bills/{bill-id}/{additional-bill-detail-type}')));
      });

      it("performs request to the endpoint respecting the given congress", () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/bills/{bill-id}/{additional-bill-detail-type}')));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against the 105th congress as the earliest', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}')
          .then(() => verify(validators.isValidCongress(anything(), 105)));
      });

      it('rejects with an invalid bill ID', () => {
        return ppc.getAdditionalBillDetails('{invalid-bill-id}', '{additional-bill-detail-type}')
          .should.be.rejectedWith(Error, 'Received invalid bill id:');
      });

      it('validates against recent bill types', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}')
          .then(() => verify(validators.isValidType('{additional-bill-detail-type}', [
            'subjects',
            'amendments',
            'related',
            'cosponsors'
          ])));
      });

      it('rejects with an invalid recent bill type', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{invalid-additional-bill-detail-type}')
          .should.be.rejectedWith(Error, 'Received invalid additional bill detail type:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getAdditionalBillDetails('{bill-id}', '{additional-bill-detail-type}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getMemberList()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/members'", () => {
        return ppc.getMemberList('{chamber}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/members')));
      });

      it("performs request to the endpoint respecting the given congress", () => {
        return ppc.getMemberList('{chamber}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/members')));
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getMemberList('{chamber}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getMemberList('{chamber}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getMemberList('{invalid-chamber}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('validates against the 102nd congress as the earliest for the house', () => {
        return ppc.getMemberList('house')
          .then(() => verify(validators.isValidCongress(anything(), 102)));
      });

      it('reject on house lists before the 102nd congress', () => {
        return ppc.getMemberList('house', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('reject on senate lists before the 80th congress', () => {
        return ppc.getMemberList('senate', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against the 80th congress as the earliest for the senate', () => {
        return ppc.getMemberList('senate')
          .then(() => verify(validators.isValidCongress(anything(), 80)));
      });
    });

    describe('.getNewMembers()', () => {
      it("performs a request to an endpoint resembling 'members/new'", () => {
        return ppc.getNewMembers()
          .then(() => looseVerify(api.get('members/new')));
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getNewMembers()
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getNewMembers({offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getVotesByMember()', () => {
      it("performs a request to an endpoint resembling 'members/{member-id}/votes'", () => {
        return ppc.getVotesByMember('{member-id}')
          .then(() => looseVerify(api.get('members/{member-id}/votes')));
      });

      it('rejects with an invalid member ID', () => {
        return ppc.getVotesByMember('{invalid-member-id}')
          .should.be.rejectedWith(Error, 'Received invalid member id:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getVotesByMember('{member-id}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getVotesByMember('{member-id}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getMemberComparison()', () => {
      /**
       * Helper to minimize repeating this multi-line invocation. Wraps around the call to
       * ppc.getMemberComparison using an options hash whose keys map to the arguments of the method
       * the required parameters have default values set which may or may not be referenced in a
       * test. They may also be overridden for the purposes of the test.
       *
       * @param {Object} [{
       *         firstMemberId = '{member-id}',
       *         secondMemberId = '{second-member-id}',
       *         chamber = '{chamber}',
       *         memberComparisonType = '{member-comparison-type}',
       *         congress,
       *         offset
       *       }={}]
       * @returns
       */
      function getMemberComparison({
        firstMemberId = '{member-id}',
        secondMemberId = '{second-member-id}',
        chamber = '{chamber}',
        memberComparisonType = '{member-comparison-type}',
        congress,
        offset
      } = {}) {
        return ppc.getMemberComparison(
          firstMemberId,
          secondMemberId,
          chamber,
          memberComparisonType,
          Object.assign({}, congress ? {congress} : {}, offset ? {offset} : {})
        );
      }

      it("performs request to an endpoint resembling 'members/{first-member-id}/{member-comparison-type}/{second-member-id}/{congress}/{chamber}'", () => {
        return getMemberComparison()
          .then(() => looseVerify(api.get('members/{member-id}/{member-comparison-type}/{second-member-id}/{congress}/{chamber}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return getMemberComparison({congress: '{different-congress}'})
          .then(() => looseVerify(api.get('members/{member-id}/{member-comparison-type}/{second-member-id}/{different-congress}/{chamber}')));
      });

      it('sets the offset to 0 by default', () => {
        return getMemberComparison()
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return getMemberComparison({offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });

      it('rejects with an invalid first member ID', () => {
        return getMemberComparison({firstMemberId: '{invalid-member-id}'})
          .should.be.rejectedWith(Error, 'Received invalid member id:');
      });

      it('rejects with an invalid second member ID', () => {
        return getMemberComparison({secondMemberId: '{invalid-second-member-id}'})
          .should.be.rejectedWith(Error, 'Received invalid member id:');
      });

      it('rejects with an invalid chamber', () => {
        return getMemberComparison({chamber: '{invalid-chamber}'})
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('validates against the 101st congress as the earliest for the senate', () => {
        return getMemberComparison({chamber: 'senate'})
          .then(() => verify(validators.isValidCongress(anything(), 101)));
      });

      it('validates against the 102nd congress as the earliest for the house', () => {
        return getMemberComparison({chamber: 'house'})
          .then(() => verify(validators.isValidCongress(anything(), 102)));
      });

      it('rejects with representative comparisons before the 102nd congress', () => {
        return getMemberComparison({chamber: 'house', congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with senator comparisons before the 101st congress', () => {
        return getMemberComparison({chamber: 'senate', congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against member comparison types', () => {
        return getMemberComparison()
          .then(() => verify(validators.isValidType('{member-comparison-type}', [
            'bills',
            'votes',
          ])));
      });

      it('rejects with an invalid member comparison type', () => {
        return getMemberComparison({memberComparisonType: '{invalid-member-comparison-type}'})
          .should.be.rejectedWith(Error, 'Received invalid member comparison type:');
      });
    });

    describe('.getCurrentSenators()', () => {
      it("performs a request to an endpoint resembling 'members/senate/{state}/current'", () => {
        return ppc.getCurrentSenators('{state}')
          .then(() => looseVerify(api.get('members/senate/{state}/current')));
      });

      it('rejects with an invalid state', () => {
        return ppc.getCurrentSenators('{invalid-state}')
          .should.be.rejectedWith(Error, 'Received invalid state:');
      });
    });

    describe('.getCurrentRepresentatives()', () => {
      it("performs a request to an endpoint resembling 'members/house/{state}/{district}/current'", () => {
        return ppc.getCurrentRepresentatives('{state}', '{district}')
          .then(() => looseVerify(api.get('members/house/{state}/{district}/current')));
      });

      it('rejects with an invalid state', () => {
        return ppc.getCurrentRepresentatives('{invalid-state}', '{district}')
          .should.be.rejectedWith(Error, 'Received invalid state:');
      });

      it('rejects with an invalid district', () => {
        return ppc.getCurrentRepresentatives('{state}', '{invalid-district}')
          .should.be.rejectedWith(Error, 'Received invalid district:');
      });
    });

    describe('.getLeavingMembers()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/members/leaving'", () => {
        return ppc.getLeavingMembers('{chamber}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/members/leaving')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getLeavingMembers('{chamber}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/members/leaving')));
      });

      it('validates against the 111th congress as the earliest', () => {
        return ppc.getLeavingMembers('{chamber}')
          .then(() => verify(validators.isValidCongress(anything(), 111)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getLeavingMembers('{invalid-congress}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getLeavingMembers('{invalid-chamber}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getLeavingMembers('{chamber}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getLeavingMembers('{chamber}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getBillsByMember()', () => {
      it("performs a request to an endpoint resembling 'members/{member-id}/bills/{member-bill-type}'", () => {
        return ppc.getBillsByMember('{member-id}', '{member-bill-type}')
          .then(() => looseVerify(api.get('members/{member-id}/bills/{member-bill-type}')));
      });

      it('validates against member bill types', () => {
        return ppc.getBillsByMember('{member-id}', '{member-bill-type}')
          .then(() => verify(validators.isValidType('{member-bill-type}', [
            'introduced',
            'updated'
          ])));
      });

      it('rejects with an invalid member bill type', () => {
        return ppc.getBillsByMember('{member-id}', '{invalid-member-bill-type}')
          .should.be.rejectedWith(Error, 'Received invalid member bill type');
      });

      it('rejects with an invalid member ID', () => {
        return ppc.getBillsByMember('{invalid-member-id}', '{member-bill-type}')
          .should.be.rejectedWith(Error, 'Received invalid member id:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getBillsByMember('{chamber}', '{recent-bill-type}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getBillsByMember('{chamber}', '{recent-bill-type}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getRollCallVotes()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/sessions/{session-number}/votes/{roll-call-number}'", () => {
        return ppc.getRollCallVotes('{chamber}', '{session-number}', '{roll-call-number}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/sessions/{session-number}/votes/{roll-call-number}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getRollCallVotes('{chamber}', '{session-number}', '{roll-call-number}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/sessions/{session-number}/votes/{roll-call-number}')));
      });

      it('validates against the 102nd congress as the earliest for the house', () => {
        return ppc.getRollCallVotes('house', '{session-number}', '{roll-call-number}', {congress: '{different-congress}'})
          .then(() => verify(validators.isValidCongress(anything(), 102)));
      });

      it('validates against the 101st congress as the earliest for the senate', () => {
        return ppc.getRollCallVotes('senate', '{session-number}', '{roll-call-number}', {congress: '{different-congress}'})
          .then(() => verify(validators.isValidCongress(anything(), 101)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getRollCallVotes('{chamber}', '{session-number}', '{roll-call-number}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getRollCallVotes('{invalid-chamber}', '{session-number}', '{roll-call-number}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('rejects with an invalid session number', () => {
        return ppc.getRollCallVotes('{chamber}', '{invalid-session-number}', '{roll-call-number}')
          .should.be.rejectedWith(Error, 'Received invalid session number:');
      });

      it('rejects with an invalid roll call number', () => {
        return ppc.getRollCallVotes('{chamber}', '{session-number}', '{invalid-roll-call-number}')
          .should.be.rejectedWith(Error, 'Received invalid roll call number:');
      });
    });

    describe('.getVotesByDate()', () => {
      it("performs a request to an endpoint resembling '{chamber}/votes/{year}/{month}'", () => {
        return ppc.getVotesByDate('{chamber}', '{year}', '{month}')
          .then(() => looseVerify(api.get('{chamber}/votes/{year}/{month}')));
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getVotesByDate('{invalid-chamber}', '{year}', '{month}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('rejects with an invalid year', () => {
        return ppc.getVotesByDate('{chamber}', '{invalid-year}', '{month}')
          .should.be.rejectedWith(Error, 'Received invalid year: ');
      });

      it('rejects with an invalid month', () => {
        return ppc.getVotesByDate('{chamber}', '{year}', '{invalid-month}')
          .should.be.rejectedWith(Error, 'Received invalid month: ');
      });
    });

    describe('.getVotes()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/votes/{vote-type}'", () => {
        return ppc.getVotes('{chamber}', '{vote-type}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/votes/{vote-type}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getVotes('{chamber}', '{vote-type}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/votes/{vote-type}')));
      });

      it('validates against the 102nd congress as the earliest for the house', () => {
        return ppc.getVotes('house', '{vote-type}')
          .then(() => verify(validators.isValidCongress(anything(), 102)));
      });

      it('validates against the 101st congress as the earliest for the senate', () => {
        return ppc.getVotes('senate', '{vote-type}')
          .then(() => verify(validators.isValidCongress(anything(), 101)));
      });

      it('rejects with an invalid congress', () => {
        ppc.getVotes('{chamber}', '{vote-type}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getVotes('{invalid-chamber}', '{vote-type}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('validates against vote types', () => {
        return ppc.getVotes('{chamber}', '{vote-type}')
          .then(() => verify(validators.isValidType('{vote-type}', [
            'missed',
            'party',
            'loneno',
            'perfect'
          ])));
      });

      it('rejects with an invalid vote type', () => {
        return ppc.getVotes('{chamber}', '{invalid-vote-type}')
          .should.be.rejectedWith(Error, 'Received invalid vote type:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getVotes('{chamber}', '{vote-type}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getVotes('{chamber}', '{vote-type}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getSenateNominationVotes()', () => {
      it("performs a request to an endpoint resembling '{congress}/nominations'", () => {
        return ppc.getSenateNominationVotes()
          .then(() => looseVerify(api.get('{congress}/nominations')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getSenateNominationVotes({congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/nominations')));
      });

      it('validates against the 101st congress as the earliest', () => {
        return ppc.getSenateNominationVotes()
          .then(() => verify(validators.isValidCongress(anything(), 101)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getSenateNominationVotes({congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getSenateNominationVotes()
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getSenateNominationVotes({offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getNominees()', () => {
      it("performs a request to an endpoint resembling '{congress}/nominees/{nominee-type}'", () => {
        return ppc.getNominees('{nominee-type}')
          .then(() => looseVerify(api.get('{congress}/nominees/{nominee-type}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getNominees('{nominee-type}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/nominees/{nominee-type}')));
      });

      it('validates against the 107st congress as the earliest', () => {
        return ppc.getNominees('{nominee-type}')
          .then(() => verify(validators.isValidCongress(anything(), 107)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getNominees('{nominee-type}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('validates against nominee types', () => {
        return ppc.getNominees('{nominee-type}')
          .then(() => verify(validators.isValidType('{nominee-type}', [
            'received',
            'updated',
            'confirmed',
            'withdrawn'
          ])));
      });

      it('rejects with an invalid nominee type', () => {
        return ppc.getNominees('{invalid-nominee-type}')
          .should.be.rejectedWith(Error, 'Received invalid nominee type:');
      });
    });

    describe('.getNomineesByState()', () => {
      it("performs a request to an endpoint resembling '{congress}/nominees/state/{state}'", () => {
        return ppc.getNomineesByState('{state}')
          .then(() => looseVerify(api.get('{congress}/nominees/state/{state}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getNomineesByState('{state}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/nominees/state/{state}')));
      });

      it('validates against the 107st congress as the earliest', () => {
        return ppc.getNomineesByState('{state}')
          .then(() => verify(validators.isValidCongress(anything(),107)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getNomineesByState('{state}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid state', () => {
        return ppc.getNomineesByState('{invalid-state}')
          .should.be.rejectedWith(Error, 'Received invalid state:');
      });
    });

    describe('.getPartyCounts()', () => {
      it("performs a request to an endpoint resembling 'states/members/party'", () => {
        return ppc.getPartyCounts()
          .then(() => looseVerify(api.get('states/members/party')));
      });
    });

    describe('.getCommittees()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/committees'", () => {
        return ppc.getCommittees('{chamber}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/committees')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getCommittees('{chamber}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/committees')));
      });

      it('validates against the 110th congress as the earliest', () => {
        return ppc.getCommittees('{chamber}')
          .then(() => verify(validators.isValidCongress(anything(), 110)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getCommittees('{chamber}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getCommittees('{invalid-chamber}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getCommittees('{chamber}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getCommittees('{chamber}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getCommitteeMembers()', () => {
      it("performs a request to an endpoint resembling '{congress}/{chamber}/committees/{committee-id}'", () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}')
          .then(() => looseVerify(api.get('{congress}/{chamber}/committees/{committee-id}')));
      });

      it("performs request to an endpoint respecting the given congress", () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}', {congress: '{different-congress}'})
          .then(() => looseVerify(api.get('{different-congress}/{chamber}/committees/{committee-id}')));
      });

      it('validates against the 110th congress as the earliest', () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}')
          .then(() => verify(validators.isValidCongress(anything(), 110)));
      });

      it('rejects with an invalid congress', () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}', {congress: '{invalid-congress}'})
          .should.be.rejectedWith(Error, 'Received invalid congress:');
      });

      it('rejects with an invalid chamber', () => {
        return ppc.getCommitteeMembers('{invalid-chamber}', '{committee-id}')
          .should.be.rejectedWith(Error, 'Received invalid chamber:');
      });

      it('rejects with an invalid committee ID', () => {
        return ppc.getCommitteeMembers('{chamber}', '{invalid-committee-id}')
          .should.be.rejectedWith(Error, 'Received invalid committee id:');
      });

      it('sets the offset to 0 by default', () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}')
          .then(() => verify(api.get(anything(), 0)));
      });

      it('sets the given offset', () => {
        return ppc.getCommitteeMembers('{chamber}', '{committee-id}', {offset: '{offset}'})
          .then(() => verify(api.get(anything(), '{offset}')));
      });
    });

    describe('.getMember()', () => {
      it("performs a request to an endpoint resembling 'members/{member-id}'", () => {
        return ppc.getMember('{member-id}')
          .then(() => looseVerify(api.get('members/{member-id}')));
      });

      it('rejects with an invalid member ID', () => {
        return ppc.getMember('{invalid-member-id}')
          .should.be.rejectedWith(Error, 'Received invalid member id:');
      });
    });
  });
});

