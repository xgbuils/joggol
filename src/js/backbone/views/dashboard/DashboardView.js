var View = require('frontpiece.view')

var DashboardView = View.extend({
    initialize: function (options) {
        var view = this
        this.$el = $(options.el)
        this.el  = this.$el[0]
        this.appModel = options.appModel

        this.fieldsetViews    = options.fieldsetViews
        //console.log(this.fieldsetViews)
        this.createButtonView = options.createButtonView
        this.descriptionView  = options.descriptionView
        this.controlBarView   = options.controlBarView
        for (var name in options.fieldsetViews) {
            //console.log(view.fieldsetViews[name].parent)
            this.fieldsetViews[name].parent = this
        }
        this.currentFieldset = undefined
        this.currentField    = undefined

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var oldFieldset = view.currentFieldset
            if (oldFieldset !== undefined) {
                oldFieldset.trigger('blur')
                oldField = oldFieldset.focusField
                oldField.trigger('blur')
                view.currentFieldset   = undefined
                oldFieldset.focusField = undefined
                view.trigger('blur')
            }
            view.controlBarView.trigger('inactive')
        })

        this.render()

        this.on('click-dashboard', function (newFieldset, newField) {
            var oldFieldset = this.currentFieldset
            var oldField
            if (oldFieldset !== newFieldset) {
                if (oldFieldset !== undefined) {
                    oldField = oldFieldset.focusField
                    oldFieldset.trigger('blur')
                    oldField.trigger('blur')
                    oldFieldset.focusField = undefined
                }
                this.currentFieldset = newFieldset
                newFieldset.trigger('focus')
                newFieldset.focusField = newField
                newField.trigger('focus', newFieldset.keyboardView)
            } else if (oldField !== newField) {
                oldField = oldFieldset.focusField
                oldField.trigger('blur')
                newFieldset.focusField = newField
                newField.trigger('focus', newFieldset.keyboardView)
            }
            if (!view.controlBarView.active) {
                view.controlBarView.trigger('active')
            }
        })

        this.on('blur', function () {
            console.log('BLUR TOTAL')
            this.appModel.set('generatorKB', undefined)
        })
    },
    render: function () {
        ;['balls', 'period', 'height'].forEach(function (field) {
            this.fieldsetViews[field].render()
        }, this)
        this.createButtonView.render()
    }
})

module.exports = DashboardView