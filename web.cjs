const express = require('express');
const enforce = require('express-sslify');
const compression = require('compression');
const myApp = express();
const port = 4200;

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
