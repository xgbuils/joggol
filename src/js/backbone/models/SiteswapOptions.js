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
        var balls  = this.get('balls')
        var period = this.get('period')
        attr.height     || (attr.height = {})
        attr.height.max || (attr.height.max = period.get('max') * height.get('max'))
        this.set('height', new HeightOptions(attr.height))
    },
    toJSON: function () {
        return globalToJSON(this)
    }
})

module.exports = SiteswapOptions