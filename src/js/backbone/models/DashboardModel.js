var RecursiveModel = require('frontpiece.recursive-model')
var Model          = require('frontpiece.model')

var modelGet = Model.prototype.get

var DashboardModel = RecursiveModel.extend({
    initialize: function () {
        var model = this
        var FIELDSETS_ARRAY = ['balls', 'period', 'height']
        var FIELDS_ARRAY    = ['min', 'max']

        var fields = FIELDSETS_ARRAY.reduce(function (fieldsets, fieldsetName) {
            fieldsets[fieldsetName] = FIELDS_ARRAY.reduce(function (fields, fieldName) {
                var field = fields[fieldName] = new RecursiveModel({
                    active: false,
                    fieldset: fieldsetName,
                    field: fieldName
                })
                return fields
            }, {})
            return fieldsets
        }, {})

        this.set(
            FIELDSETS_ARRAY.reduce(function (dashboard, fieldsetName) {
                dashboard[fieldsetName] = new RecursiveModel(fields[fieldsetName])
                return dashboard
            }, {})
        )

        this.on('change:fieldset', function (previous) {
            var current = this.get('fieldset')
            triggerChanges(this, 'fieldset', previous, current)
        })

        FIELDSETS_ARRAY.forEach(function (fieldsetName) {
            FIELDS_ARRAY.forEach(function (fieldName) {
                var field = fields[fieldsetName][fieldName]
                field.on('change:active', function (previous) {
                    var current = this.get('active')
                    if (previous !== current) {
                        var previousFieldset = model.get('fieldset')
                        var previousField    = model.get('field')
                        var currentFieldset  = this.get('fieldset')
                        var currentField     = this.get('field')
                        var change = {}
                        if (current) {
                            if (previousFieldset !== currentFieldset) {
                                model.set('fieldset', currentFieldset/*, {silent: true}*/)
                                change.fieldset = true
                                //triggerChanges(this, 'fieldset', previousFieldset, currentFieldset)
                            }
                            if (previousField !== currentField) {
                                model.set('field', currentField/*, {silent: true}*/)
                                change.field = true
                                //triggerChanges(this, 'field', previousField, currentField)
                            }
                            if (change.fieldset || change.field) {
                                if (previousField && previousFieldset) {
                                    fields[previousFieldset][previousField].set('active', false)
                                }
                                //this.set('active', true, {silent: true})
                            }
                        } else {
                            if (currentFieldset === previousFieldset && currentField === previousField) {
                                model.set('fieldset', undefined)
                                model.set('field   ', undefined)
                            }
                        }
                    }
                })
            })
        })
    },
    getModel: function (key) {
        var keys = key.split('.')
        var len = keys.length
        var model = this
        for (var i = 0; i < len; ++i) {
            model = modelGet.call(model, keys[i])
        }
        return model        
    }
})

function triggerChanges(model, eventName, previous, current) {
    if (previous) {
        model.trigger('change:' + eventName + ':' + previous + '=false')
    }
    if (current) {
        model.trigger('change:' + eventName + ':' + current  + '=true')
    }
}

module.exports = DashboardModel