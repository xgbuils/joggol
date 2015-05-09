var BallsOptions  = require('./BallsOptions')
var PeriodOptions = require('./PeriodOptions')
var HeightOptions = require('./HeightOptions')

var BBModel  = Backbone.Model
var BBtoJSON = BBModel.prototype.toJSON
var globalToJSON = function (model) {
    //console.log('aa')
    var object = model instanceof BBModel ? BBtoJSON.call(model) : model
    //console.log(object)
    if (object && typeof object === 'object') {
        var json   = {}
        for (var key in object) {
            json[key] = globalToJSON(object[key])
        }
        return json
    } else {
        return object
    }
}

var SiteswapOptions = Backbone.Model.extend({
    initialize: function (attr, opt) {
        this.set('balls' , new BallsOptions (attr.balls ))
        this.set('period', new PeriodOptions(attr.period))
        var model = this
        var balls  = this.get('balls')
        var period = this.get('period')
        attr.height     || (attr.height = {})
        attr.height.max || (attr.height.max = balls.get('max') * period.get('max'))
        this.set('height', new HeightOptions(attr.height))

        ;['balls', 'period', 'height'].forEach(function (field) {
            var modelField = model.get(field)
            modelField.on('change', function () {
                console.log('eooeoeoooeoooe', model.toJSON())
                model.trigger('change')
                model.trigger('change:' + field)
            })
        })
    },
    toJSON: function () {
        return globalToJSON(this)
    }
})

module.exports = SiteswapOptions