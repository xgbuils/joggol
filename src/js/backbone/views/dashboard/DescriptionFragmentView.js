var generateText = require('../../../messages/generate-text.js')
var lang         = require('language')

var DescriptionFragmentView = Backbone.View.extend({
    initialize: function (options) {
        var view  = this
        this.name = options.name
        this.$el  = $(options.el)

        this.model = options.model
        if (this.model.isValid()) {
            view.render()
        }
        this.model.on('valid', function (o, error) {
            view.render()
        })
    },
    render: function () {
        console.log(this.name)
        this.$el.text(generateText[this.name]({}, this.model.get(), this.$el, lang))
    }
})

module.exports = DescriptionFragmentView