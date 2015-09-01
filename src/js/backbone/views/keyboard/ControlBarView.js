var View = require('frontpiece.view')

var ControlBarView = View.extend({
    initialize: function (options) {
        var view = this

        var $el = this.$el = $(options.el)
        this.el = $el[0]

        var appModel = this.appModel = options.appModel

        this.keyboardViews = options.keyboardViews
        this.width     = $el.outerWidth()
        var widthLeft  = $('#keyboard-left' , $el).outerWidth()
        var widthRight = $('#keyboard-right', $el).outerWidth()
        var keyboardWidth = view.width - widthLeft - widthRight

        // current keyboard
        this.currentKB = {
            simulator: options.patternsKeyboardView
        }
        // layout/generator
        this.layout = undefined

        appModel.on('keyboard:active', function() {
            view.$el.removeClass('js-hide')
        })

        appModel.on('keyboard:inactive', function() {
            view.$el.addClass('js-hide')
        })

        this.$el.on('click', '#keyboard-left' , function (event) {
            event.preventDefault()
            event.stopPropagation()
            view.triggerKeyboard('left')
        })

        this.$el.on('click', '#keyboard-right', function (event) {
            event.preventDefault()
            event.stopPropagation()
            view.triggerKeyboard('right')
        })

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
        })
    },
    triggerKeyboard: function (dir) {
        var appModel = this.appModel
        appModel.trigger('keyboard-' + appModel.get('keyboard') + ':move', dir)
    }
})

module.exports = ControlBarView