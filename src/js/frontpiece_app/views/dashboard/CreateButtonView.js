var View = require('frontpiece.view')

var querystring = require('querystring')
var rangeEncode = require('../../../utils/range').encode

var CreateButtonView = View.extend({
    initialize: function (options) {
        var view   = this
        this.$el   = $(options.el)
        this.el    = this.$el[0]

        var model    = this.model    = options.model
        var appModel = this.appModel = options.appModel

        this.render()
        model.on('valid', function () {
            view.render()
            appModel.trigger('simulator-enabled')
        })
        model.on('invalid', function () {
            view.render()
            appModel.trigger('simulator-disabled')
        })
    },
    render: function () {
        var model = this.model
        if (model.isValid()) {
            var options = model.get()
            for (var key in options) {
                options[key] = rangeEncode(options[key])
            }
            var qs = querystring.encode(options)

            this.$el.attr('href', '#simulator?' + qs)
            this.$el.removeClass('disabled')
        } else {
            this.$el.addClass('disabled')
        }
    }
})

module.exports = CreateButtonView