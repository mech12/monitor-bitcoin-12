var browserify = require('browserify')
  , envify = require('envify/custom')
  , fs = require('fs')

var b = browserify('js/app.js')
  , output = fs.createWriteStream('bundle.js')

b.transform(envify({
  NODE_ENV: 'development'
}))
b.bundle().pipe(output)