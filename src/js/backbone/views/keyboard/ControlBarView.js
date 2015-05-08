var ControlBarView = Backbone.View.extend({
    initialize: function (options) {
        var view = this

        var $el = this.$el = $(options.el)
        this.el = $el[0]

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
            this.active = true
            console.log('controlBar active')
            this.$el.removeClass('js-hide')
            //console.log('id: ', newKeyboardView.el.id, 'key: ', key)
        })

        this.on('inactive', function() {
            this.active = false
            console.log('controlBar inactive')
            this.$el.addClass('js-hide')
            //console.log('id: ', newKeyboardView.el.id, 'key: ', key)
        })

        this.$el.on('click', '#keyboard-left' , function (event) {
            event.preventDefault()
            event.stopPropagation()
            view.currentKB[view.layout].trigger('left')
        })

        this.$el.on('click', '#keyboard-right', function (event) {
            event.preventDefault()
            event.stopPropagation()
            view.currentKB[view.layout].trigger('right')
        })

        view.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
        })

        this.on('change-layout', function (name) {
            var oldKeyboard = this.currentKB[this.layout]
            if (oldKeyboard) {
                // if change layout: header <--> generator, no inactive oldKeyboard
                if (this.layout !== 'header' && name !== 'header') {
                    oldKeyboard.trigger('inactive')
                }
            }
            this.layout = name === 'header' ? 'generator' : name
            var newKeyboard = this.currentKB[name]
            if (newKeyboard) {
                console.log('b')
                newKeyboard.trigger('active')
            } else if (oldKeyboard){
                console.log('c')
                this.trigger('inactive')
            }            
        })

        view.on('keyboard-active', function (keyboard) {
            view.currentKB[this.layout] = keyboard
        })
    },

})

module.exports = ControlBarView