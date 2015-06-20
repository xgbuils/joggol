var View = require('frontpiece.view')
var native_android_browser = require('../../../utils/native_android_browser')

var FieldsetView = View.extend({
    initialize: function (options) {
        var view = this
        this.name = options.name
        this.$el  = $(options.el)
        this.el   = this.$el[0]

        this.name           = options.name
        this.focusField     = undefined

        var model           = this.model          = options.model
        var dashboardModel  = this.dashboardModel = options.dashboardModel
        var keyboardModel   = this.keyboardModel  = options.keyboardModel
        var appModel        = this.appModel       = options.appModel

        this.computeStyles()

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var minFieldModel = view.dashboardModel.getModel(view.name + '.min')
            if (!minFieldModel.get('active')) {
                minFieldModel.set('active', true)
                keyboardModel.set('field', 'min')
            }
        })

        dashboardModel.on('change:fieldset:' + this.name + '=true', function (previous) {
            view.trigger('focus')
        })
        dashboardModel.on('change:fieldset:' + this.name + '=false', function (previous) {
            view.trigger('blur')
        })

        this.on('focus', function () {
            appModel.set('generatorKB', this.name)
            appModel.set('keyboard', this.name)

            $item = $('.editable', view.$el)
            $item.addClass('expanded')
            $item.removeClass('minEqMax minLessOrEq1')
        })

        this.on('blur', function () {
            appModel.set('generatorKB', undefined)
            appModel.set('keyboard', undefined)
            this.blur()
        })

        $item = $('.editable', view.$el)
        $item.addClass('expanded')
        this.blur()
    },
    computeStyles: function () {
        if (native_android_browser) {
            $('.editable', this.$el).addClass('android-browser')
        }
        $('.collapsed', this.$el).each(function (index, item) {
            var $item = $(item)
            $item.removeClass('js-hide')
            var width = $item.outerWidth()
            $item.data('width', width)
            $item.css('width', width)
        })

        $('.word-expanded', this.$el).each(function (index, item) {
            var $item = $(item)
            var width = $item.outerWidth()
            $item.data('width', width)
            $item.css('width', width)
        })
    },
    blur: function () {
        var $item = $('.editable', this.$el)
        var min = this.model.get('min')
        var max = this.model.get('max')
        if (min === max) {
            $item.removeClass('expanded')
            $item.addClass('minEqMax')
        } else if (min === 1) {
            $item.removeClass('expanded')
            $item.addClass('minLessOrEq1')
        }
    }
})

module.exports = FieldsetView