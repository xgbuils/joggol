var querystring = require('querystring')
var rangeEncode = require('../../../utils/range').encode

var CreateButtonView = Backbone.View.extend({
    initialize: function (options) {
        var view   = this
        this.$el   = $(options.el)
        this.el    = this.$el[0]
        this.keyboardView = options.keyboardView

        this.model = this.model
        this.model.on('valid', function () {
            console.log('valido!', this.get())
            view.render()
        })
    },
    render: function () {
        if (this.model.isValid()) {
            console.log('dentro')
            var options = this.model.get()
            for (var key in options) {
                options[key] = rangeEncode(options[key])
            }
            var qs = querystring.encode(options)
            console.log(qs)

            this.$el.attr('href', '#!simulator/?' + qs)
        }
    }
})

module.exports = CreateButtonView