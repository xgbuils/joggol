var View = require('frontpiece.view')

var FieldView = View.extend({
    initialize: function (options) {
        var view  = this
        this.name = options.name
        this.$el  = $(options.el)
        this.el   = view.$el[0]
        var model         = this.model         = options.model
        var rangeModel    = this.rangeModel    = options.rangeModel
        var keyboardModel = this.keyboardModel = options.keyboardModel

        this.computeStyles()

        this.render()

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            model.set('active', true)
            keyboardModel.set('field', model.get('field'))
        })

        this.model.on('change:active', function (previous) {
            var current = this.get('active')
            if (previous !== current) {
                view.trigger(current ? 'focus' : 'blur')
            }
        })

        rangeModel.on('change:' + this.name, function () {
            view.render()
        })

        view.on('focus', function (keyboardView) {
            var $el = this.$el
            $el.addClass('js-select')
        })

        view.on('blur', function () {
            this.$el.removeClass('js-select')
        })
    },
    render: function () {
        var value = this.rangeModel.get(this.name)
        this.$el.text(value)
    },
    computeStyles: function () {
        this.width = this.$el.width()
        this.$el.width(this.width)
        this.minWidth = '40px'
    }
})

module.exports = FieldView