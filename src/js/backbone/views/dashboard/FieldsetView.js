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
        var appModel        = this.appModel       = options.appModel

        this.computeStyles()
        $item = $('.editable', view.$el)
        $item.addClass('expanded')
        this.blur()

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var focus = appModel.get('focus')
            var fieldName = view.name + '.min'
            if (focus !== fieldName) {
                appModel.set('focus', fieldName)
            }
        })

        appModel.on('focus:' + this.name, function () {
            appModel.set('generatorKB', view.name)
            appModel.set('keyboard', view.name)

            $item = $('.editable', view.$el)
            $item.addClass('expanded')
            $item.removeClass('minEqMax minLessOrEq1')
        })

        appModel.on('blur:' + this.name, function () {
            appModel.set('generatorKB', undefined)
            appModel.set('keyboard', undefined)
            view.blur()
        })
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