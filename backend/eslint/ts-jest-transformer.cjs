/** CJS wrapper — ts-jest v29 puts createTransformer on default export. */
const tsJest = require('ts-jest');

module.exports = {
  createTransformer(options) {
    return tsJest.default.createTransformer(options);
  },
};
