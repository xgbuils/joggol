var View = require('frontpiece.view')

var ControlBarView = View.extend({
    initialize: function (options) {
        var view = this

        var $el = this.$el = $(options.el)
        this.el = $el[0]

        this.appModel = options.appModel

        this.keyboardViews = options.keyboardViews
        this.width     = $el.outerWidth()
        var widthLeft  = $('#keyboard-left' , $el).outerWidth()
        var widthRight = $('#keyboard-right', $el).outerWidth()
        var keyboardWidth = view.width - widthLeft - widthRight

        for (var name in view.keyboardViews) {
            var keyboard   = view.keyboardViews[name]
            keyboard.outerWidth = view.width
            keyboard.width      = keyboardWidth
            keyboard.parent     = view
        }

        // current keyboard
        this.currentKB = {
            simulator: options.patternsKeyboardView
        }
        // layout
        this.layout = undefined

        this.on('active', function() {
            this.appModel.set('controlBarActive', true)
            this.$el.removeClass('js-hide')
        })

        this.on('inactive', function() {
            this.appModel.set('controlBarActive', false)
            this.$el.addClass('js-hide')
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

        this.appModel.on('change:generatorKB', function (previous) {
            console.log('CHANGE GENERATOR KB')
            var keyboardName     = this.get('generatorKB')
            var controlBarActive = this.get('controlBarActive')
            if (previous) {
                view.keyboardViews[previous].trigger('inactive')
            }
            if (!controlBarActive) {
                view.trigger('active')
            }
            if (keyboardName) {
                view.keyboardViews[keyboardName].trigger('active')
            }
            
        })

        this.appModel.on('change:layout', function (previous) {
            var controlBarActive = this.get('controlBarActive')
            var layoutName       = this.get('layout')
            var keyboardName
            if        (layoutName === 'header' && controlBarActive) {
                console.log('inactive ControlBarView')
                view.trigger('inactive')
            } else {
                keyboardName = this.get('generatorKB')
                if (layoutName === 'generator') {
                    console.log('GENERATOOOR', keyboardName, controlBarActive, previous)                   
                    if (keyboardName && !controlBarActive) {
                        view.trigger('active')
                    }
                    if (previous === 'simulator') {
                        view.keyboardViews['patterns'].trigger('inactive')
                        if (keyboardName) {
                            view.keyboardViews[keyboardName].trigger('active')
                        }
                    }
                    if (keyboardName === undefined && controlBarActive) {
                        view.trigger('inactive')
                    }
                } else if (layoutName === 'simulator') {
                    if (keyboardName) {
                        view.keyboardViews[keyboardName].trigger('inactive')
                    }
                    if (!controlBarActive) {
                        view.trigger('active')
                    }
                    view.keyboardViews['patterns'].trigger('active')
                }
            }
        })
    },
    triggerKeyboard: function (dir) {
        var currentKeyboard
        var currentLayout = this.appModel.get('layout')
        var keyboardName
        if     (currentLayout === 'generator') {
            keyboardName = this.appModel.get('generatorKB')
        } else if (currentLayout === 'simulator') {
            keyboardName = 'patterns'
        }
        this.keyboardViews[keyboardName].trigger(dir)
    }
})

module.exports = ControlBarView