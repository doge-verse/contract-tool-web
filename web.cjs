const express = require('express');
const enforce = require('express-sslify');
const compression = require('compression');
const myApp = express();
const port = 4200;
const API_URL = process.env.API_URL || 'https://account-test.spacescope.io';

console.log(API_URL, process.env.API_URL)
if (process.env.SSLREDIRECT && process.env.SSLREDIRECT !== 'false') {
  myApp.use(enforce.HTTPS({ trustProtoHeader: true }));
  console.log('ssl redirect enabled.');
}
myApp.use(compression());
myApp.use(
  express.static('./dist', {
    etag: true,
    lastModified: true,
    maxAge: '1m',
  }),
);

myApp.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'dist' });
});


myApp.listen(process.env.PORT || port);
console.log(
  `Running webapp in ${process.env.NODE_ENV}, PORT ${process.env.PORT || port}`,
);
