var querystring = require('querystring')
var rangeEncode = require('../../../utils/range').encode

var CreateButtonView = Backbone.View.extend({
    initialize: function (options) {
        var view   = this
        this.$el   = $(options.el)
        this.el    = this.$el[0]
        this.keyboardView = options.keyboardView

        this.on('create-model', function (model) {
            //console.log('CreateButtonView')
            this.model = model
            this.keyboardView.trigger('create-model', model)

            this.model.on('change', function () {
                console.log('todo el modelo cambiado')
                view.render()
            })
        })
    },
    render: function () {
        var options = this.model.toJSON()
        for (var key in options) {
            options[key] = rangeEncode(options[key])
        }
        var qs = querystring.encode(options)
        console.log(qs)

        this.$el.attr('href', '#!simulator/?' + qs)
    }
})

module.exports = CreateButtonView