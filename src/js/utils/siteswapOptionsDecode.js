var querystring = require('querystring')
var rangeDecode = require('./range').decode

function siteswapOptionsDecode (qs) {
    var options   = querystring.decode(qs)

    ;['balls', 'period', 'height'].forEach(function (field) {
        var range = rangeDecode(options[field])
        if (range) {
            options[field] = range
        }
    })

    return options
}

module.exports = siteswapOptionsDecode