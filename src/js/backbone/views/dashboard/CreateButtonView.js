var View = require('frontpiece.view')

var querystring = require('querystring')
var rangeEncode = require('../../../utils/range').encode

var CreateButtonView = View.extend({
    initialize: function (options) {
        var view   = this
        this.$el   = $(options.el)
        this.el    = this.$el[0]

        this.model = options.model

        this.render()
        this.model.on('valid', function () {
            view.render()
        })
    },
    render: function () {
        if (this.model.isValid()) {
            var options = this.model.get()
            for (var key in options) {
                options[key] = rangeEncode(options[key])
            }
            var qs = querystring.encode(options)

            this.$el.attr('href', '#simulator/?' + qs)
        }
    }
})

module.exports = CreateButtonView