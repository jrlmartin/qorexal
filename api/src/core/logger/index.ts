// https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
// This will fix most of the errors not logging in the console because they are normally stripped out of stringify.
if (!('toJSON' in Error.prototype)) {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      // Use Object.getOwnPropertyNames and reduce to create a new object
      // with the same properties as the original error object
      return Object.getOwnPropertyNames(this).reduce((alt, key) => {
        alt[key] = this[key];
        return alt;
      }, {});
    },
    configurable: true,
    writable: true,
  });
}

export * from './logger';
export * from './decorators';
export * from './exception.filter';
