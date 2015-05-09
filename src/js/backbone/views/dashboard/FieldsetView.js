var native_android_browser = require('../../../utils/native_android_browser')

var FieldsetView = Backbone.View.extend({
    initialize: function (options) {
        var view = this
        this.$el = $(options.el)
        this.el  = this.$el[0]

        this.minField      = options.minView
        this.maxField      = options.maxView
        this.minField.type = 'min'
        this.maxField.type = 'max'
        this.focusField    = undefined

        if (options.keyboardView) {
            this.keyboardView = options.keyboardView
            this.keyboardView.fieldsetView = this
        }

        if (options.model) {
            this.trigger('create-model', options.model)
        }

        this.computeStyles()

        //console.log('keyboard: ', view.keyboardView)

        this.minField.parent = this.maxField.parent = this

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            view.trigger('click-field', view.minField)
        })

        this.on('create-model', function (model) {
            console.log('Fieldset')
            this.model = model

            this.model.on('change:min', function () {
                console.log('modelo cambiado')
                console.log(view.model)
                view.minField.$el.text(view.model.get('min'))
            })
    
            this.model.on('change:max', function () {
                console.log('modelo cambiado')
                console.log(view.model.get('max'))
                view.maxField.$el.text(view.model.get('max'))
            })

            this.keyboardView.trigger('create-model', model)
        })

        

        view.on('click-field', function (field) {
            view.parent.trigger('click-dashboard', view, field)
        })

        view.on('focus', function () {
            //var key = field.$el.text()
            view.keyboardView.trigger('active')

            //console.log(view.el.id, ' focus')
            //field.trigger('focus', view.keyboardView)
            //this.focusField = field
            $item = $('.editable', view.$el)
            $item.addClass('expanded')
            $item.removeClass('minEqMax minLessOrEq1')
        })

        view.on('blur', function () {
            /*if (view.focusField !== undefined) {
                view.focusField.trigger('blur')
                view.focusField = undefined
            }*/
            view.keyboardView.trigger('inactive')
            //console.log('fieldset ', view.el.id, ' blur')
            var $item = $('.editable', view.$el)
            var min = this.model.get('min')
            var max = this.model.get('max')
            if (min === max) {
                $item.removeClass('expanded')
                $item.addClass('minEqMax')
            } else if (min === 1) {
                $item.removeClass('expanded')
                $item.addClass('minLessOrEq1')
            }
        })
    },
    render: function () {
        var min = this.model.get('min')
        var max = this.model.get('max')
        this.minField.$el.text(min)
        this.maxField.$el.text(max)
    },
    computeStyles: function () {
        if (native_android_browser) {
            $('.editable', this.$el).addClass('android-browser')
        }
    }
})

module.exports = FieldsetView