const {replace, when, verify, matchers: {
  anything,
  contains,
  argThat
}} = require('testdouble')
  , URL = require('url')
  , {API_VERSION, API_HOST} = require('./../src/defaults');

require('chai').use(require('chai-as-promised')).should();

// aliases to verify and when with the ignoreExtraArgs config option set to true
const looseWhen = fakeInvocation => when(fakeInvocation, {ignoreExtraArgs: true});
const looseVerify = fakeInvocation => verify(fakeInvocation, {ignoreExtraArgs: true});

describe('api', () => {
  let http, createApi, validators;
  beforeEach(() => {
    http = replace('./../src/http');
    validators = replace('./../src/validators');
    createApi = require('./../src/api').create;

    // validation invocations pass by default
    looseWhen(validators.isValidOffset())
      .thenReturn(true);

    looseWhen(validators.isValidApiKey())
      .thenReturn(true);
  });

  describe('create()', () => {
    it(
      "sets .key to the given key",
      () => createApi('SOME_KEY').key.should.equal('SOME_KEY')
    );

    it('throws with an invalid key', () => {
      when(validators.isValidApiKey(anything()))
        .thenReturn(false);

      (() => createApi())
        .should.throw(Error, 'Received invalid API key:');
    });
  });

  describe('.get()', () => {
    let api;
    beforeEach(() => {
      api = createApi('SOME_KEY');

      looseWhen(http.get())
        .thenResolve({});
    });

    it("sets the 'X-API-Key' header with the given key", () => {
      return api.get('some/endpoint')
        .then(() => verify(http.get(
          anything(),
          contains({headers: {'X-API-Key': 'SOME_KEY'}})
        )));
    });

    it("expects a JSON response", () => {
      return api.get('some/endpoint')
        .then(() => verify(http.get(
          anything(),
          contains({json: true})
        )));
    });

    it("sets an offset from the second argument", () => {
      return api.get('some/endpoint', 20)
        .then(() => verify(http.get(
          anything(),
          contains({body: {offset: 20}})
        )));
    });

    it("performs the request to the ProPublica API host", () => {
      return api.get('some/endpoint')
        .then(() => looseVerify(http.get(
          argThat(url => url.indexOf(API_HOST) === 0)
        )));
    });

    it("performs the request to version 1 of ProPublica's Congress API", () => {
      return api.get('some/endpoint')
        .then(() => looseVerify(http.get(
          argThat(url => URL.parse(url).path.indexOf(`/congress/v${API_VERSION}/`) === 0)
        )));
    });

    it("performs the request to the JSON variant of the endpoint", () => {
      return api.get('some/endpoint')
        .then(() => looseVerify(http.get(
          argThat(url => url.substr(-'some/endpoint.json'.length) === 'some/endpoint.json')
        )));
    });

    it('rejects if given an invalid offset value', () => {
      when(validators.isValidOffset('an invalid offset'))
        .thenReturn(false);

      return api.get('some/endpoint', 'an invalid offset')
        .should.be.rejectedWith(Error, 'Received invalid offset:');
    });

    it("resolves to the value of the 'body' key", () => {
      looseWhen(http.get())
        .thenResolve({body: 'some body data'});

      return api.get('some/endpoint').should.become('some body data');
    });
  });
});
