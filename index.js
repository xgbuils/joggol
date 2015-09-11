var parse = require('url').parse;
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('dist'));

var sites = {
  'ca': true,
  'es': true,
  'en': true
}

app.get('/', requestCallback);
app.get('/header', requestCallback);
app.get('/generator', requestCallback);
app.get(/^\/simulator(\?.*)?$/, requestCallback);

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


function requestCallback(req, res) {
  var subdomain = req.get('host').split('.')[0];
  var lang = 'en'
  if (sites[subdomain]) {
    lang = subdomain
  }
  console.log(lang)
  res.sendFile('dist/prod/' + lang + '/index.html', {
    root: __dirname
  });
}