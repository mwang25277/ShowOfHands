# propublica-congress

> ProPublica Congress API client

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm install --save propublica-congress
```


```bash
yarn add propublica-congress
```

## Usage

```javascript
const ppc = require('propublica-congress').create('PROPUBLICA_API_KEY');

ppc.getCurrentSenators('NY')
  .then(results => console.log(results));
```

## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/propublica-congress.svg
[npm-url]: https://npmjs.org/package/propublica-congress
