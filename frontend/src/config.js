/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.')
}

module.exports = {
  // default locale is the first one
  locales: [
    /* @intl-code-template '${lang}-${COUNTRY}', */
    'en-US',
    /* @intl-code-template-end */
  ],

  // Node.js app
  port: process.env.PORT || 3000,

  api: {
    url: process.env.API_URL || 'http://localhost:8000/api',
    appUrl: process.env.APP_URL || 'http://localhost:8000',
    // oauth keys
    clientId: process.env.CLIENT_ID || '4XnsRQTGMUp1TO3WCniWsl1TH1sNmjcfqU5Keh5C',
    clientSecret: process.env.CLIENT_SECRET || 'ugpViM0R29N1Ki70ZMB9PI126gFygDkHau7Ztf11L9yuQ9cIoWIzXExhoMetgJpV1YAS9szAsjs6KmCM4IIl8Y5zFklUDBfj07o7nUCQp2MmM66GBvn3lvSCY3z2WfPn',
  },
}
