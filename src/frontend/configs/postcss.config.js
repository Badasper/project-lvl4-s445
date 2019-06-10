/* eslint-disable import/no-extraneous-dependencies */
const Autoprefixer = require('autoprefixer');
const CssMqpacker = require('css-mqpacker');
const Cssnano = require('cssnano');

module.exports = {
  plugins: [
    Autoprefixer,
    CssMqpacker,
    Cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
