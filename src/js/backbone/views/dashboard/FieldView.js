var View = require('frontpiece.view')

var FieldView = View.extend({
    initialize: function (options) {
        var view  = this
        this.fieldset = options.fieldset
        this.field    = options.field
        var name = this.fieldset + '.' + this.field
        this.$el  = $(options.el)
        this.el   = view.$el[0]
        var appModel      = this.appModel      = options.appModel
        var rangeModel    = this.rangeModel    = options.rangeModel

        this.computeStyles()

        this.render()

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            appModel.set('focus', name)
        })

        rangeModel.on('change:' + this.field, function () {
            view.render()
        })

        appModel.on('focus:' + this.fieldset + '.' + this.field, function () {
            view.$el.addClass('js-select')
        })

        appModel.on('blur:' + name, function () {
            view.$el.removeClass('js-select')
        })
    },
    render: function () {
        var value = this.rangeModel.get(this.field)
        this.$el.text(value)
    },
    computeStyles: function () {
        this.width = this.$el.width()
        this.$el.width(this.width)
        this.minWidth = '40px'
    }
})

module.exports = FieldView