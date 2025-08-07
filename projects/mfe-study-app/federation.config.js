const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'mfe-study-app',
  filename: 'remoteEntry.js',  // 🔥 Isso faz o arquivo ser servido
  //apenas para desennvolvimento publicPath: 'http://localhost:4201/',
  publicPath: '/mfe-study-app/', 
  withPublicPath: true,

  exposes: {
    './routes': './projects/mfe-study-app/src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
  
});
